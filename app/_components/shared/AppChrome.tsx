"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AppChromeProps {
  children: ReactNode;
}

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname.startsWith("/dashboard")) return null;
  return children;
}
