import React from "react";
import type { Metadata } from "next";
import PageClient from "./page.client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../_lib/supabase/auth";

export const dynamic = "force-dynamic";

export type SlugType = "motherboard" | "cpu" | "graphic";

export interface PiecesProps {
  params: {
    slug: SlugType[];
  };
}

export const metadata: Metadata = {
  title: "گفت و گو",
  description: "",
};
const Page = async () => {
  if (!(await getCurrentUser())) redirect("/login?next=/chat");
  return <PageClient />;
};

export default Page;
