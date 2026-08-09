import React from "react";
import type { Metadata } from "next";
import PageClient from "./page.client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../_lib/supabase/auth";

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
  title: "افزودن آگهی  ",
  description: "",
};
const Page = async () => {
  if (!(await getCurrentUser())) redirect("/login?next=/ads/create");
  return <PageClient />;
};

export default Page;
