import type { Metadata } from "next";
import { getSiteUrl } from "@/_utils/siteUrl";
import PageClient from "./page.client";

const url = `${getSiteUrl()}/choose-part`;

export const metadata: Metadata = {
  title: "انتخاب قطعات",
  description: "",
  alternates: { canonical: url },
  openGraph: { url, siteName: "ریگورا" },
};
const Page = () => {
  return <PageClient showAssistant />;
};

export default Page;
