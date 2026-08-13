"use client";

import {
  IconAd,
  IconBox,
  IconCpu,
  IconDashboard,
  IconExternalLink,
  IconMessageCircle,
  IconArticle,
} from "@tabler/icons-react";
import { Badge, Box, Divider, NavLink, ScrollArea, Text } from "@mantine/core";
import Link from "next/link";
import classes from "./navbar.module.css";

interface NavbarProps {
  onNavigate: () => void;
  pathname: string;
}

const legacyCatalog = [
  { label: "پردازنده", href: "/dashboard/cpu" },
  { label: "مادربرد", href: "/dashboard/motherboard" },
  { label: "کارت گرافیک", href: "/dashboard/graphic" },
  { label: "منبع تغذیه", href: "/dashboard/power" },
  { label: "خنک‌کننده", href: "/dashboard/fan" },
  { label: "حافظه رم", href: "/dashboard/ram" },
  { label: "حافظه SSD", href: "/dashboard/ssd" },
  { label: "کیس", href: "/dashboard/case" },
];

export default function Navbar({ onNavigate, pathname }: NavbarProps) {
  return (
    <ScrollArea className={classes.scrollArea} type="auto">
      <Box p="sm">
        <Text c="dimmed" fz={10} fw={700} mb="xs" px="sm">
          عملیات
        </Text>
        <NavLink
          active={pathname === "/dashboard"}
          component={Link}
          href="/dashboard"
          label="نمای کلی"
          leftSection={<IconDashboard size={19} />}
          onClick={onNavigate}
          variant="light"
        />
        <NavLink
          active={pathname.startsWith("/dashboard/articles")}
          component={Link}
          href="/dashboard/articles"
          label="مدیریت مقالات"
          leftSection={<IconArticle size={19} />}
          onClick={onNavigate}
          variant="light"
        />
        <NavLink
          active={pathname.startsWith("/dashboard/ads")}
          component={Link}
          href="/dashboard/ads"
          label="مدیریت آگهی‌ها"
          leftSection={<IconAd size={19} />}
          onClick={onNavigate}
          rightSection={
            <Badge size="xs" variant="light">
              فعال
            </Badge>
          }
          variant="light"
        />
        <NavLink
          component={Link}
          href="/chat"
          label="گفت‌وگوهای سایت"
          leftSection={<IconMessageCircle size={19} />}
          onClick={onNavigate}
          rightSection={<IconExternalLink size={14} />}
        />

        <Divider my="md" />
        <Text c="dimmed" fz={10} fw={700} mb="xs" px="sm">
          ابزارهای قدیمی
        </Text>
        <NavLink
          defaultOpened={legacyCatalog.some(({ href }) =>
            pathname.startsWith(href),
          )}
          label="کاتالوگ قطعات"
          leftSection={<IconCpu size={19} />}
          rightSection={
            <Badge color="gray" size="xs">
              محلی
            </Badge>
          }
        >
          {legacyCatalog.map((item) => (
            <NavLink
              active={pathname.startsWith(item.href)}
              component={Link}
              href={item.href}
              key={item.href}
              label={item.label}
              leftSection={<IconBox size={15} />}
              onClick={onNavigate}
              variant="subtle"
            />
          ))}
        </NavLink>
        <Text c="dimmed" fz={10} lh={1.7} mt="sm" px="sm">
          این بخش از داده‌های محلی استفاده می‌کند و تغییرات آن هنوز پایدار نیست.
        </Text>
      </Box>
    </ScrollArea>
  );
}
