import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "./server";
import { createAdminClient } from "./admin";
import type { Database } from "../../types/database.types";

export interface AdminSession {
  client: SupabaseClient<Database>;
  user: User;
}

/**
 * Resolve the current session together with the server-side admin (secret-key)
 * client, but only for an authenticated administrator whose session jwt role is
 * 'admin'. Returns null otherwise so callers can respond 401. The acting user id
 * lets handlers reject self-destructive actions (e.g. an admin deleting or
 * demoting their own account).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const serverClient = await createClient();
    const {
      data: { user },
      error,
    } = await serverClient.auth.getUser();
    if (error || !user) return null;
    const role = user.app_metadata?.role;
    if (role !== "admin") return null;
    return { client: createAdminClient(), user };
  } catch {
    return null;
  }
}

/**
 * Same authorization check as getAdminSession, but only the secret-key client.
 * Used by the manually-triggered price-sync endpoints so no token must ever live
 * in the browser.
 */
export async function getAdminForSession(): Promise<SupabaseClient<Database> | null> {
  const session = await getAdminSession();
  return session?.client ?? null;
}
