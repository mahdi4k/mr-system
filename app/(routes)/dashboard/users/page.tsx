import type { Metadata } from "next";
import { getCurrentUser } from "../../../_lib/supabase/auth";
import UsersClient from "./UsersClient";

export const metadata: Metadata = {
  title: "مدیریت کاربران | ریگورا",
  description: "جستجو، نقش‌بندی و مسدودسازی کاربران ریگورا",
};

export default async function UsersPage() {
  const user = await getCurrentUser();

  return <UsersClient currentUserId={user?.id ?? null} />;
}
