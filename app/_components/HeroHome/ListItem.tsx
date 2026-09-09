"use client";
import { Box, Group, List, Text, ThemeIcon } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const ListItem = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const router = useRouter();

  const handleAddAdsPage = () => {
    if (isAuthenticated) {
      router.push("/ads/create", { scroll: true });
    } else {
      router.push("/login", { scroll: true });
    }
  };

  return (
    <>
      <List
        styles={{ itemIcon: { display: "flex" } }}
        mt={30}
        spacing="lg"
        size="sm"
        icon={
          <ThemeIcon color="#A08556" size={20} radius="xl">
            <IconCheck />
          </ThemeIcon>
        }
      >
        <List.Item style={{ lineHeight: "25px" }}>
          <Group gap={"4px"}>
            قطعاتت رو با اطمینان{" "}
            <Text c={"var(--mantine-color-green-9)"} fz={"sm"}>
              <Link href={"/choose-part"}>انتخاب کن</Link>
            </Text>{" "}
            و بابت گلوگاه خیالت راحت
          </Group>
        </List.Item>
        <List.Item>
          <Group gap={"4px"}>
            به راحتی{" "}
            <Box
              component={Link}
              href={"/ads/create"}
              style={{ cursor: "pointer" }}
            >
              <Text c={"var(--mantine-color-green-9)"} fz={"sm"}>
                آگهی ثبت کن
              </Text>
            </Box>{" "}
            و قطعات مورد نیازت رو با بهترین قیمت{" "}
            <Link href={"/ads"}>پیدا کن</Link>!
          </Group>
        </List.Item>
        <List.Item>
          <Group gap={"2px"}>
            <Text fz={"14px"}>قبل از خرید، بهترین گزینه</Text>{" "}
            <Text c={"var(--mantine-color-green-9)"} fz={"xs"}>
              (
              <Link
                style={{ marginRight: "3px", marginLeft: "3px" }}
                href={"/category/cpu"}
              >
                cpu
              </Link>
              ,
              <Link
                style={{ marginRight: "3px", marginLeft: "3px" }}
                href={"/category/motherboard"}
              >
                مادربرد
              </Link>
              ,
              <Link
                style={{ marginRight: "3px", marginLeft: "3px" }}
                href={"/category/graphic"}
              >
                کارت گرافیک
              </Link>
              ,...)
            </Text>
            <Text fz={"14px"}>و قیمت رو از ترب و ایمالز بررسی کن</Text>
          </Group>
        </List.Item>
      </List>
    </>
  );
};

export default ListItem;
