import React from "react";
import type { Metadata } from "next";
import PageClient from "./page.client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../_lib/supabase/auth";
import { createClient } from "../../../_lib/supabase/server";

export interface Province {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  province_id: number;
}
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ثبت آگهی جدید | ریگورا",
  description: "قطعات کامپیوتر خود را رایگان در بازار ریگورا آگهی کنید.",
};
const Page = async () => {
  if (!(await getCurrentUser())) redirect("/login?next=/ads/create");
  const { data: categories, error } = await (await createClient())
    .from("ad_categories")
    .select("id, name, icon")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);

  return <PageClient categories={categories ?? []} />;
};

export default Page;
