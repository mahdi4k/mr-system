import React from "react";
import ClientMotherboard from "./clientMotherboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لیست مادربرد",
  description: "",
};

const Motherboard = () => {
  return (
    <>
      <ClientMotherboard />
    </>
  );
};

export default Motherboard;
