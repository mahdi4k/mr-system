import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../_lib/supabase/auth";
import SavedSystemsClient from "./page.client";

export const dynamic = "force-dynamic";

export default async function SavedSystemsPage() {
  if (!(await getCurrentUser())) redirect("/login?next=/profile/systems");
  return <SavedSystemsClient />;
}
