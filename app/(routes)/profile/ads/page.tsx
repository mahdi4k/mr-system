import type { Metadata } from "next";
import PageClient from "./clientPage";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../_lib/supabase/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "آگهی‌های من ",
  description: "",
};
const Page = async () => {
  if (!(await getCurrentUser())) redirect("/login?next=/profile/ads");
  return <PageClient />;
};

export default Page;
