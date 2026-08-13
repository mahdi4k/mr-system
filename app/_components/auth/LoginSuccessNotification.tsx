"use client";

import { notifications } from "@mantine/notifications";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginSuccessNotification() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") !== "success") return;

    notifications.show({
      color: "green",
      title: "خوش آمدید",
      message: "با موفقیت وارد حساب کاربری خود شدید.",
    });
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("login");
    router.replace(
      nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname,
      { scroll: false },
    );
  }, [pathname, router, searchParams]);

  return null;
}
