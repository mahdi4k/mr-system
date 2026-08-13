import { NextResponse } from "next/server";
import { createClient } from "../../../../_lib/supabase/server";

interface RouteContext {
  params: Promise<{ conversationId: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { conversationId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, content, created_at, read_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) {
    return NextResponse.json(
      { message: "دریافت پیام‌ها ناموفق بود." },
      { status: 404 },
    );
  }

  await supabase.rpc("mark_conversation_read", {
    conversation_uuid: conversationId,
  });
  return NextResponse.json([...data].reverse());
}

export async function POST(request: Request, context: RouteContext) {
  const { conversationId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { message?: string };
  const content = body.message?.trim() ?? "";
  if (!content || content.length > 2000) {
    return NextResponse.json(
      { message: "متن پیام باید بین ۱ تا ۲۰۰۰ نویسه باشد." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    })
    .select("id, conversation_id, sender_id, content, created_at, read_at")
    .single();
  if (error) {
    return NextResponse.json(
      { message: "ارسال پیام ناموفق بود." },
      { status: 403 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
