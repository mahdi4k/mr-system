import { createClient } from "../../_lib/supabase/server";
import { Suspense } from "react";
import PageClient from "./page.client";

export interface AdsCategory {
  icon: string;
  id: number;
  name: string;
  value: string;
}

export async function generateMetadata() {
  return { title: "آگهی قطعات" };
}

export default async function Page() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("ad_categories")
    .select("id, value, name, icon")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <PageClient categories={categories ?? []} />
    </Suspense>
  );
}
