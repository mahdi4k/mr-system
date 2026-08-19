import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

let adminClient: SupabaseClient<Database> | undefined;

export function hasSecretKey(): boolean {
  return Boolean(process.env.SUPABASE_SECRET_KEY);
}

/**
 * Server-only Supabase client authenticated with the project's secret key
 * (`sb_secret_...`, the modern replacement for the legacy service_role key).
 * It bypasses RLS and is used exclusively by the price-synchronization worker
 * and by the one-time product-image import (both run server side). The secret
 * must never be exposed to the browser or prefixed with NEXT_PUBLIC_.
 */
export function createAdminClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (sb_secret_...).",
    );
  }
  if (!adminClient) {
    adminClient = createClient<Database>(url, secretKey, {
      auth: { persistSession: false },
    });
  }
  return adminClient;
}
