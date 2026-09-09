"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AppChromeProps {
  children: ReactNode;
  homeOnly?: boolean;
}

export default function AppChrome({
  children,
  homeOnly = false,
}: AppChromeProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || (homeOnly && pathname !== "/")) {
    return null;
  }

  return children;
}
