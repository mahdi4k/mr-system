"use client";

import { Box, Skeleton } from "@mantine/core";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const AdsSection = dynamic(() => import("./AdsSection"), {
  ssr: false,
  loading: () => <Skeleton height={460} mt="100px" />,
});

export default function LazyAdsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={containerRef}>
      {shouldLoad ? <AdsSection /> : <Skeleton height={460} mt="100px" />}
    </Box>
  );
}
