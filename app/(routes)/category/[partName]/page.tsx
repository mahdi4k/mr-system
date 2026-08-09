import React from "react";
import ClientPage from "./clientPage";

type Iprop = "motherboard" | "cpu" | "graphic" | "power";

export async function generateMetadata(props: {
  params: Promise<{ partName: Iprop }>;
}) {
  const params = await props.params;
  return {
    title: `لیست ${params.partName} - ریگورا`,
  };
}

const Page = async (props: { params: Promise<{ partName: Iprop }> }) => {
  const params = await props.params;
  return <ClientPage partName={params.partName} />;
};

export default Page;
