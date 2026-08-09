import type { Metadata } from "next";
import PageClient from "./clientPage";

export const metadata: Metadata = {
  title: "آگهی‌های من ",
  description: "",
};
const Page = () => {
  return <PageClient />;
};

export default Page;
