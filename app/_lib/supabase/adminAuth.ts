import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./server";
import { createAdminClient } from "./admin";
import type { Database } from "../../types/database.types";

/**
 * Resolve the server-side admin (secret-key) client, but only for an
 * authenticated administrator whose session jwt role is 'admin'. Returns null
 * otherwise so callers can respond 401. Used by the manually-triggered
 * price-sync endpoints so no token must ever live in the browser.
 */
export async function getAdminForSession(): Promise<SupabaseClient<Database> | null> {
  try {
    const serverClient = await createClient();
    const {
      data: { user },
      error,
    } = await serverClient.auth.getUser();
    if (error || !user) return null;
    const role = user.app_metadata?.role;
    if (role !== "admin") return null;
    return createAdminClient();
  } catch {
    return null;
  }
}
