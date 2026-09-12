import React from "react";
import type { Metadata } from "next";
import { getSiteUrl } from "@/_utils/siteUrl";
import ClientPage from "./clientPage";

type Iprop = "motherboard" | "cpu" | "graphic" | "power";

export async function generateMetadata(props: {
  params: Promise<{ partName: Iprop }>;
}): Promise<Metadata> {
  const params = await props.params;
  const url = new URL(`/category/${params.partName}`, getSiteUrl()).toString();
  return {
    title: `لیست ${params.partName} - ریگورا`,
    alternates: { canonical: url },
    openGraph: { url, siteName: "ریگورا" },
  };
}

const Page = async (props: { params: Promise<{ partName: Iprop }> }) => {
  const params = await props.params;
  return <ClientPage partName={params.partName} />;
};

export default Page;
