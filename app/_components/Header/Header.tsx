"use client";
import {
  Container,
  Text,
  Group,
  Burger,
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
  Box,
  Center,
  HoverCard,
  SimpleGrid,
  UnstyledButton,
  rem,
  ThemeIcon,
  Flex,
  Modal,
  Avatar,
  Menu,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import {
  IconSun,
  IconMoon,
  IconChevronDown,
  IconChartPie3,
  IconUserCircle,
  IconBrandLine,
  IconHome2,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import UseLoading from "@/_utils/customHook/useLoading";
import Image from "next/image";
import DrawerHeader from "./Drawer";
import LoginModal from "../loginModal/LoginModal";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../../_lib/supabase/client";

interface HeaderProps {
  isAuthenticated: boolean;
  userLabel?: string;
}

export function Header({ isAuthenticated, userLabel }: HeaderProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const isLoading = UseLoading();
  const router = useRouter();
  const [logoSrc, setLogoSrc] = useState<string | null>(null); // Default to null

  const pathname = usePathname();
  const hideHeaderFooter = pathname === "/login";

  useEffect(() => {
    router.prefetch("/profile");
  }, [router]);

  const handleAccountPage = () => {
    if (isAuthenticated) {
      router.push("/profile", { scroll: true });
    } else {
      router.push("/login", { scroll: true });
    }
  };

  const handleLogout = async () => {
    await createClient().auth.signOut();
    window.location.href = "/";
  };

  const handleToChatPage = () => {
    if (isAuthenticated) {
      router.push("/chat", { scroll: true });
    } else {
      openModal();
    }
  };
  useEffect(() => {
    if (colorScheme === "dark") {
      setLogoSrc("/logo-dark.png");
    } else {
      setLogoSrc("/logo.png");
    }
  }, [colorScheme]);

  // Only render the image once the logo source is set
  if (!logoSrc) {
    return null; // Prevent rendering until logoSrc is determined
  }

  return (
    <header
      style={{ display: hideHeaderFooter ? "none" : "block" }}
      className={`${classes.header} main-header`}
    >
      <Container size="lg" className={classes.inner}>
        <Burger opened={opened} onClick={open} hiddenFrom="xs" size="sm" />

        <Flex className={classes.mobileHeader} align={"center"}>
          <Link
            style={{ height: 40 }}
            className={"text-decoration-none"}
            href={"/"}
          >
            <Image
              style={{ objectFit: "contain" }}
              alt="ریگورا"
              src={logoSrc}
              width={80}
              height={40}
            />
          </Link>

          <Group mr={"xl"} h="100%" gap={0} visibleFrom="sm">
            <HoverCard
              width={750}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      قطعات
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <SimpleGrid cols={4} spacing={0}>
                  <Link href="/category/motherboard">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={20}
                            height={20}
                            src={"/svg/motherboard.svg"}
                            alt={"cpu"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          مادربرد
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>
                  <Link href="/category/graphic">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={20}
                            height={20}
                            src={"/svg/graphic.svg"}
                            alt={"cpu"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          کارت گرافیک
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>
                  <Link href="/category/power">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={20}
                            height={30}
                            src={"/svg/power.svg"}
                            alt={"cpu"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          پاور
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>

                  <Link href="/category/cpu">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={20}
                            height={20}
                            src={"/svg/cpu.svg"}
                            alt={"cpu"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          cpu
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>
                  <Link href="/category/case">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={25}
                            height={25}
                            src={"/svg/case.svg"}
                            alt={"case"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          قاب کیس
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>
                  <Link href="/category/ssd">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={25}
                            height={25}
                            src={"/svg/ssd.svg"}
                            alt={"ssd"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          ssd
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>
                  <Link href="/category/ram">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={25}
                            height={25}
                            src={"/svg/ram.svg"}
                            alt={"ram"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          رم
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>
                  <Link href="/category/fan">
                    <UnstyledButton p={"lg"} className={classes.subLink}>
                      <Group wrap="nowrap" align="center">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <Image
                            width={35}
                            height={35}
                            src={"/svg/fan.svg"}
                            alt={"fan"}
                          />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          فن
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Link>
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
        </Flex>

        <Group gap="md" wrap="nowrap">
          <ActionIcon
            onClick={handleToChatPage}
            size={"lg"}
            radius={"lg"}
            variant="transparent"
            aria-label="گفتگوها"
          >
            <IconBrandLine size={24} />
          </ActionIcon>

          {isLoading && (
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light",
                )
              }
              variant="subtle"
              size="lg"
              radius="lg"
              aria-label="تغییر حالت رنگ"
              color={"#7ea300"}
            >
              {computedColorScheme === "light" ? <IconMoon /> : <IconSun />}
            </ActionIcon>
          )}

          {isAuthenticated ? (
            <Menu position="bottom-end" shadow="md" width={210}>
              <Menu.Target>
                <UnstyledButton
                  aria-label="منوی حساب کاربری"
                  className={classes.accountButton}
                >
                  <Avatar color="green" radius="xl" size={34}>
                    {(userLabel || "ک").trim().charAt(0).toUpperCase()}
                  </Avatar>
                  <Text
                    className={classes.accountName}
                    fz="sm"
                    fw={600}
                    visibleFrom="sm"
                  >
                    {userLabel || "کاربر ریگورا"}
                  </Text>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>حساب کاربری</Menu.Label>
                <Menu.Item
                  leftSection={<IconUserCircle size={17} />}
                  onClick={() => router.push("/profile")}
                >
                  پروفایل من
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconHome2 size={17} />}
                  onClick={() => router.push("/profile/ads")}
                >
                  آگهی‌های من
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={17} />}
                  onClick={handleLogout}
                >
                  خروج از حساب
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              aria-label="ورود یا ثبت نام"
              leftSection={<IconLogin size={18} />}
              onClick={handleAccountPage}
              radius="xl"
              size="xs"
              variant="light"
            >
              <Text visibleFrom="sm" inherit>
                ورود / ثبت نام
              </Text>
              <Text hiddenFrom="sm" inherit>
                ورود
              </Text>
            </Button>
          )}
        </Group>
      </Container>
      <DrawerHeader opened={opened} close={close} />

      <Modal opened={openedModal} onClose={closeModal} title="ورود / ثبت نام">
        <LoginModal close={closeModal} />
      </Modal>
    </header>
  );
}
