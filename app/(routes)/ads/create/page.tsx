import React from "react";
import type { Metadata } from "next";
import PageClient from "./page.client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Import redirect utility

export interface Province {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  province_id: number;
}
export const metadata: Metadata = {
  title: "افزودن آگهی  ",
  description: "",
};
const Page: React.FC = () => {
  return <PageClient />;
};

export default Page;
