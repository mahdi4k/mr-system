import { notFound, redirect } from "next/navigation";
import { getAdById } from "../../../../_features/ads/data";
import { getCurrentUser } from "../../../../_lib/supabase/auth";
import { createClient } from "../../../../_lib/supabase/server";
import PageClient from "./page.client";

export default async function EditAdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/ads/${id}/edit`);

  const ad = await getAdById(id, await createClient());
  if (!ad || ad.user_id !== user.id) notFound();

  const { data: categories, error } = await (await createClient())
    .from("ad_categories")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);

  return <PageClient ad={ad} categories={categories ?? []} />;
}
