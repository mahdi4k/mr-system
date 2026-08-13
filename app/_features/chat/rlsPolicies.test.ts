import fs from "node:fs";
import path from "node:path";

describe("Rigora chat RLS migration", () => {
  const migration = fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations/20260812010000_chat.sql"),
    "utf8",
  );

  it("enables RLS on conversations and messages", () => {
    expect(migration).toContain(
      "alter table public.conversations enable row level security",
    );
    expect(migration).toContain(
      "alter table public.messages enable row level security",
    );
  });

  it("limits reads and writes to conversation participants", () => {
    expect(migration).toContain("Participants read conversations");
    expect(migration).toContain("Participants read messages");
    expect(migration).toContain("Participants send their own messages");
    expect(migration).toContain("sender_id = (select auth.uid())");
  });

  it("creates conversations through a protected RPC", () => {
    expect(migration).toContain("get_or_create_conversation");
    expect(migration).toContain("ads.status = 'published'");
    expect(migration).toContain("You cannot start a conversation");
  });

  it("publishes persisted messages to Supabase Realtime", () => {
    expect(migration).toContain(
      "alter publication supabase_realtime add table public.messages",
    );
  });

  it("marks messages read through a narrow RPC instead of update RLS", () => {
    expect(migration).toContain("mark_conversation_read");
    expect(migration).not.toContain(
      'create policy "Participants mark received messages read"',
    );
  });

  it("retains ad access for existing conversation participants", () => {
    expect(migration).toContain(
      "Published ads owner and participants are readable",
    );
    expect(migration).toContain("conversations.ad_id = ads.id");
  });
});
