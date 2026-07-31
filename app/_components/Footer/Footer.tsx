"use client";
import {
  Container,
  Group,
  ActionIcon,
  rem,
  Text,
  useMantineColorScheme,
  Flex,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconMail,
} from "@tabler/icons-react";
import classes from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const data = [
  {
    title: "آگهی قطعات",
    links: [
      { label: "cpu", link: "/ads?total_page=1&category=cpu" },
      { label: "مادربرد", link: "/ads?total_page=1&category=motherboard" },
      { label: "کارت گرافیک", link: "/ads?total_page=2&category=graphic" },
      { label: "پاور", link: "/ads?total_page=2&category=power" },
    ],
  },
  {
    title: "قیمت قطعات",
    links: [
      { label: "cpu", link: "/category/cpu" },
      { label: "مادربرد", link: "/category/motherboard" },
      { label: "گرافیک", link: "/category/graphic" },
      { label: "پاور", link: "/category/power" },
    ],
  },
  {
    title: "تماس با ما",
    links: [
      {
        label: (
          <Flex align={"center"}>
            <IconBrandTelegram color="green" size={16} />
            <Text mr={"5px"} fz={"sm"}>
              kiwipart_support@
            </Text>
          </Flex>
        ),
        link: "https://t.me/kiwi_part",
      },
      {
        label: (
          <Flex mt={"5px"} align={"center"}>
            <IconMail color="green" size={16} />
            <Text mr={"5px"} fz={"sm"}>
              support@kiwipart.ir
            </Text>
          </Flex>
        ),
        link: "mailto:support@kiwipart.ir",
      },
    ],
  },
];

export function Footer() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const [logoSrc, setLogoSrc] = useState<string | null>(null); // Default to null

  const pathname = usePathname();
  const hideHeaderFooter = pathname === "/login";

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

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Link key={index} className={classes.link} href={link.link}>
        {link.label}
      </Link>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text mb={"xs"} fw={"bolder"} className={classes.title}>
          {group.title}
        </Text>
        {links}
      </div>
    );
  });
  return (
    <footer
      style={{ display: hideHeaderFooter ? "none" : "block" }}
      className={classes.footer}
    >
      <Container size={"lg"} className={classes.inner}>
        <div className={classes.logo}>
          <Image
            style={{ objectFit: "contain" }}
            alt="kiwi part"
            src={logoSrc}
            width={80}
            height={40}
          />

          <Text size="sm" c="dimmed" className={classes.description}>
            هوشمندانه انتخاب کن، قیمت‌ها رو مقایسه کن و با خیال راحت سیستمت
            اسمبل کن!
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2025 kiwi part. All rights reserved
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon
            component={Link}
            target="_blank"
            href={"https://www.linkedin.com/in/mahdi-falahati-b21045b8/"}
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandLinkedin size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            component={Link}
            target="_blank"
            href={"https://t.me/kiwi_part"}
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandTelegram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
