"use client";
import React from "react";
import { Skeleton } from "@mantine/core";

const LoadingSkeleton = () => {
  return (
    <>
      <Skeleton mb={"md"} height={485} />
    </>
  );
};

export default LoadingSkeleton;
