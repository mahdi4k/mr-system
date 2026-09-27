import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

export interface UnreadChatState {
  conversationIds: string[];
  count: number;
}

export const EMPTY_UNREAD_CHAT_STATE: UnreadChatState = {
  conversationIds: [],
  count: 0,
};

export interface IncomingMessageRef {
  conversation_id: string;
  sender_id: string;
}

/**
 * Count the messages waiting for the signed-in user.
 *
 * A message is unread when it lives in one of the user's conversations, was sent
 * by somebody else, and has no `read_at` stamp yet. RLS already limits the
 * conversation list to the current participant, so the only filtering left to do
 * here is the sender check.
 */
export async function fetchUnreadChatState(
  client: SupabaseClient<Database>,
  userId: string | null,
): Promise<UnreadChatState> {
  if (!userId) return EMPTY_UNREAD_CHAT_STATE;

  const { data: conversations, error: conversationsError } = await client
    .from("conversations")
    .select("id");
  if (conversationsError) return EMPTY_UNREAD_CHAT_STATE;

  const conversationIds = (conversations ?? []).map((row) => row.id);
  if (!conversationIds.length) return EMPTY_UNREAD_CHAT_STATE;

  const { count, error } = await client
    .from("messages")
    .select("id", { count: "exact", head: true })
    .in("conversation_id", conversationIds)
    .is("read_at", null)
    .neq("sender_id", userId);

  return { conversationIds, count: error ? 0 : (count ?? 0) };
}

/**
 * Whether a realtime insert should raise the header badge. Broadcast channels
 * are not guaranteed to be filtered by RLS, so the conversation is matched
 * against the ids fetched with the count.
 */
export function isUnreadIncomingMessage(
  message: IncomingMessageRef,
  userId: string | null,
  conversationIds: string[],
): boolean {
  if (!userId) return false;
  if (message.sender_id === userId) return false;
  return conversationIds.includes(message.conversation_id);
}
