"use client";

import { MantineColorsTuple, createTheme } from "@mantine/core";
const rigora: MantineColorsTuple = [
  "#ECFDF5",
  "#D1FAE5",
  "#A7F3D0",
  "#6EE7B7",
  "#34D399",
  "#10B981",
  "#059669",
  "#047857",
  "#065F46",
  "#064E3B",
];

const green: MantineColorsTuple = [
  "#ebfbee",
  "#d3f9d8",
  "#b2f2bb",
  "#8ce99a",
  "#69db7c",
  "#51cf66",
  "#40c057",
  "#37b24d",
  "#2f9e44",
  "#2b8a3e",
];
export const theme = createTheme({
  colors: {
    rigora,
  },
  primaryColor: "green",
});
