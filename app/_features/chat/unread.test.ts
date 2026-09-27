import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { fetchUnreadChatState, isUnreadIncomingMessage } from "./unread";

interface QueryResult {
  count?: number | null;
  data?: Array<{ id: string }> | null;
  error?: { message: string } | null;
}

interface RecordedCall {
  filters: Array<[string, unknown]>;
  head: boolean;
  table: string;
}

function createFakeClient(responses: {
  conversations?: QueryResult;
  messages?: QueryResult;
}) {
  const calls: RecordedCall[] = [];

  const client = {
    from(table: string) {
      const call: RecordedCall = { filters: [], head: false, table };
      calls.push(call);
      const builder: Record<string, unknown> = {};

      const result =
        table === "conversations"
          ? (responses.conversations ?? { data: [] })
          : (responses.messages ?? { count: 0 });

      builder.select = (_columns: string, options?: { head?: boolean }) => {
        call.head = Boolean(options?.head);
        return builder;
      };
      builder.in = (column: string, values: unknown) => {
        call.filters.push(["in", { column, values }]);
        return builder;
      };
      builder.is = (column: string, value: unknown) => {
        call.filters.push(["is", { column, value }]);
        return builder;
      };
      builder.neq = (column: string, value: unknown) => {
        call.filters.push(["neq", { column, value }]);
        return builder;
      };
      builder.then = (resolve: (value: QueryResult) => unknown) =>
        Promise.resolve(result).then(resolve);

      return builder;
    },
  };

  return {
    calls,
    client: client as unknown as SupabaseClient<Database>,
  };
}

const USER_ID = "11111111-1111-4111-8111-111111111111";
const OTHER_ID = "22222222-2222-4222-8222-222222222222";
const CONVERSATION_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const CONVERSATION_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

describe("fetchUnreadChatState", () => {
  it("returns nothing for a signed-out visitor", async () => {
    const { client, calls } = createFakeClient({});
    await expect(fetchUnreadChatState(client, null)).resolves.toEqual({
      conversationIds: [],
      count: 0,
    });
    expect(calls).toHaveLength(0);
  });

  it("does not query messages when the user has no conversations", async () => {
    const { client, calls } = createFakeClient({ conversations: { data: [] } });
    await expect(fetchUnreadChatState(client, USER_ID)).resolves.toEqual({
      conversationIds: [],
      count: 0,
    });
    expect(calls.map((call) => call.table)).toEqual(["conversations"]);
  });

  it("counts unread messages sent by somebody else", async () => {
    const { client, calls } = createFakeClient({
      conversations: { data: [{ id: CONVERSATION_A }, { id: CONVERSATION_B }] },
      messages: { count: 4 },
    });

    await expect(fetchUnreadChatState(client, USER_ID)).resolves.toEqual({
      conversationIds: [CONVERSATION_A, CONVERSATION_B],
      count: 4,
    });

    const messageCall = calls[1];
    expect(messageCall.table).toBe("messages");
    expect(messageCall.head).toBe(true);
    expect(messageCall.filters).toEqual([
      [
        "in",
        { column: "conversation_id", values: [CONVERSATION_A, CONVERSATION_B] },
      ],
      ["is", { column: "read_at", value: null }],
      ["neq", { column: "sender_id", value: USER_ID }],
    ]);
  });

  it("degrades to zero instead of throwing when a query fails", async () => {
    const conversations = createFakeClient({
      conversations: { error: { message: "denied" } },
    });
    await expect(
      fetchUnreadChatState(conversations.client, USER_ID),
    ).resolves.toEqual({ conversationIds: [], count: 0 });

    const messages = createFakeClient({
      conversations: { data: [{ id: CONVERSATION_A }] },
      messages: { count: null, error: { message: "denied" } },
    });
    await expect(
      fetchUnreadChatState(messages.client, USER_ID),
    ).resolves.toEqual({
      conversationIds: [CONVERSATION_A],
      count: 0,
    });
  });
});

describe("isUnreadIncomingMessage", () => {
  it("raises the badge for a message in one of my conversations", () => {
    expect(
      isUnreadIncomingMessage(
        { conversation_id: CONVERSATION_A, sender_id: OTHER_ID },
        USER_ID,
        [CONVERSATION_A],
      ),
    ).toBe(true);
  });

  it("ignores my own messages", () => {
    expect(
      isUnreadIncomingMessage(
        { conversation_id: CONVERSATION_A, sender_id: USER_ID },
        USER_ID,
        [CONVERSATION_A],
      ),
    ).toBe(false);
  });

  it("ignores conversations that are not mine", () => {
    expect(
      isUnreadIncomingMessage(
        {
          conversation_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
          sender_id: OTHER_ID,
        },
        USER_ID,
        [CONVERSATION_A],
      ),
    ).toBe(false);
  });

  it("ignores everything while signed out", () => {
    expect(
      isUnreadIncomingMessage(
        { conversation_id: CONVERSATION_A, sender_id: OTHER_ID },
        null,
        [CONVERSATION_A],
      ),
    ).toBe(false);
  });
});
