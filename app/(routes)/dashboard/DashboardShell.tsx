"use client";

import { createClient } from "../../_lib/supabase/client";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconExternalLink,
  IconHome,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "./(navbar)/Navbar";
import classes from "./dashboard-shell.module.css";

interface DashboardShellProps {
  children: React.ReactNode;
  email: string;
  label: string;
}

export default function DashboardShell({
  children,
  email,
  label,
}: DashboardShellProps) {
  const [mobileOpened, { close: closeMobile, toggle: toggleMobile }] =
    useDisclosure(false);
  const pathname = usePathname();

  const logout = async () => {
    await createClient().auth.signOut();
    window.location.href = "/";
  };

  return (
    <AppShell
      className={classes.shell}
      header={{ height: 64 }}
      navbar={{
        width: 270,
        breakpoint: "md",
        collapsed: { mobile: !mobileOpened },
      }}
      padding={{ base: "sm", sm: "lg" }}
    >
      <AppShell.Header className={classes.header}>
        <Group h="100%" justify="space-between" px={{ base: "sm", sm: "lg" }}>
          <Group gap="sm">
            <Burger
              aria-label="باز کردن منوی مدیریت"
              hiddenFrom="md"
              onClick={toggleMobile}
              opened={mobileOpened}
              size="sm"
            />
            <Link className={classes.brand} href="/dashboard">
              <Avatar color="green" radius="md" size={36}>
                R
              </Avatar>
              <div>
                <Text fw={800} fz="sm">
                  مدیریت ریگورا
                </Text>
                <Text c="dimmed" fz={10}>
                  مرکز عملیات بازار
                </Text>
              </div>
            </Link>
          </Group>

          <Group gap="xs">
            <ActionIcon
              aria-label="مشاهده سایت"
              component={Link}
              href="/"
              variant="subtle"
            >
              <IconHome size={19} />
            </ActionIcon>
            <Menu position="bottom-end" shadow="md" width={220}>
              <Menu.Target>
                <Button
                  className={classes.accountButton}
                  color="gray"
                  leftSection={
                    <Avatar color="green" radius="xl" size={28}>
                      {label.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  rightSection={<IconChevronDown size={14} />}
                  variant="subtle"
                >
                  <Text className={classes.accountLabel} fz="sm" truncate>
                    {label}
                  </Text>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  <Text fw={600} fz="xs" truncate>
                    {label}
                  </Text>
                  <Text c="dimmed" fz={10} truncate>
                    {email}
                  </Text>
                </Menu.Label>
                <Menu.Item
                  component={Link}
                  href="/"
                  leftSection={<IconExternalLink size={16} />}
                >
                  مشاهده سایت
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={16} />}
                  onClick={logout}
                >
                  خروج از حساب
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbar}>
        <Navbar pathname={pathname} onNavigate={closeMobile} />
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
