import PageClient from "./page.client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انتخاب قطعات",
  description: "",
};
const Page = () => {
  return <PageClient />;
};

export default Page;
