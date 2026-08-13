import type { Metadata } from "next";
import ClientAds from "./clientAds";

export const metadata: Metadata = {
  title: "مدیریت آگهی‌ها | ریگورا",
  description: "صف بررسی و مدیریت آگهی‌های ریگورا",
};

export default function Page() {
  return <ClientAds />;
}
