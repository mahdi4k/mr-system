import type { User } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "./config";
import { createClient } from "./server";

export async function getCurrentUser(): Promise<User | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
