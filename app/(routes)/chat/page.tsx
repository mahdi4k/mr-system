import React from "react";
import type { Metadata } from "next";
import PageClient from "./page.client";

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
const Page: React.FC = () => {
  return <PageClient />;
};

export default Page;
