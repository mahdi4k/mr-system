import React from "react";
import type { Metadata } from "next";
import ClientPower from "./clientFan";

export const metadata: Metadata = {
  title: "لیست fan",
  description: "",
};

const CPU = () => {
  return (
    <>
      <ClientPower />
    </>
  );
};

export default CPU;
