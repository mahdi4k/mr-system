"use client";

import {
  Container,
  Grid,
  Card,
  NavLink,
  Button,
  Modal,
  Text,
  Flex,
} from "@mantine/core";
import { IconUser, IconHome2, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { createClient } from "../../_lib/supabase/client";
import { api } from "../../_redux/services/api";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      dispatch(api.util.resetApiState());
      window.location.href = "/";
    } catch {
      close();
    }
  };
  return (
    <Container
      mt="lg"
      styles={{ root: { flex: "1 0 auto", width: "100%" } }}
      size="lg"
    >
      <Grid mt="xl">
        <Grid.Col span={{ base: 12, lg: 3 }}>
          <Card withBorder>
            <NavLink
              active={isActive("/profile")}
              component={Link}
              href="/profile"
              label="پروفایل"
              leftSection={<IconUser size="1rem" stroke={1.5} />}
            />
            <NavLink
              active={isActive("/profile/ads")}
              component={Link}
              href="/profile/ads"
              label="آگهی‌های من"
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
            />
            <Button
              onClick={open}
              justify="flex-start"
              color="gray"
              variant="subtle"
              size="xs"
              mt={"lg"}
              leftSection={<IconLogout size={22} />}
            >
              خروج
            </Button>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 9 }}>{children}</Grid.Col>
      </Grid>

      <Modal opened={opened} onClose={close}>
        <Text>آیا مایل به خروج از حساب کاربری خود هستید؟</Text>

        <Flex justify={"flex-end"} mt={"xl"}>
          <Button variant="outline" onClick={close} px={"md"}>
            خیر
          </Button>
          <Button onClick={() => handleLogout()} mr={"lg"} px={"xl"}>
            بله
          </Button>
        </Flex>
      </Modal>
    </Container>
  );
}
