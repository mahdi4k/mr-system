import React from "react";
import type { Metadata } from "next";
import ClientPower from "./clientRam";

export const metadata: Metadata = {
  title: "لیست ram",
  description: "",
};

const RamPage = () => {
  return (
    <>
      <ClientPower />
    </>
  );
};

export default RamPage;
