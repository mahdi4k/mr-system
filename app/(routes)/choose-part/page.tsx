import type { Metadata } from "next";
import PageClient from "./page.client";

export const metadata: Metadata = {
  title: "انتخاب قطعات",
  description: "",
};
const Page = () => {
  return <PageClient showAssistant />;
};

export default Page;
