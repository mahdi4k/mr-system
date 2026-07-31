"use client";

import { Card, Grid, Text, Group } from "@mantine/core";
import React from "react";
import Image from "next/image";
import classes from "./dashboard.module.css";
import Link from "next/link";
const page = () => {
  return (
    <Grid>
      <Grid.Col span={3}>
        <Link href={"/dashboard/cpu"}>
          <Card
            className={classes.dashboradCard}
            shadow="xs"
            radius="md"
            m={"lg"}
            p={"lg"}
          >
            <Card.Section mt={"0"} ta={"center"}>
              <Image
                width={110}
                height={100}
                src={"/svg/cpu.svg"}
                alt={"cpu"}
              />
            </Card.Section>
            <Text ta={"center"} fw={500}>
              cpu
            </Text>
          </Card>
        </Link>
      </Grid.Col>
      <Grid.Col span={3}>
        <Link href={"/dashboard/motherboard"}>
          <Card
            className={classes.dashboradCard}
            shadow="xs"
            radius="md"
            m={"lg"}
            p={"lg"}
          >
            <Card.Section mt={"0"} ta={"center"}>
              <Image
                width={110}
                height={100}
                src={"/svg/motherboard.svg"}
                alt={"cpu"}
              />
            </Card.Section>
            <Text ta={"center"} fw={500}>
              مادربرد
            </Text>
          </Card>
        </Link>
      </Grid.Col>
      <Grid.Col span={3}>
        <Link href={"/dashboard/graphic"}>
          <Card
            className={classes.dashboradCard}
            shadow="xs"
            radius="md"
            m={"lg"}
            p={"lg"}
          >
            <Card.Section mt={"0"} ta={"center"}>
              <Image
                width={110}
                height={100}
                src={"/svg/graphic.svg"}
                alt={"cpu"}
              />
            </Card.Section>
            <Text ta={"center"} fw={500}>
              کارت گرافیک
            </Text>
          </Card>
        </Link>
      </Grid.Col>
      <Grid.Col span={3}>
        <Link href={"/dashboard/power"}>
          <Card
            className={classes.dashboradCard}
            shadow="xs"
            radius="md"
            m={"lg"}
            p={"lg"}
          >
            <Card.Section mt={"0"} ta={"center"}>
              <Image
                width={110}
                height={100}
                src={"/svg/power.svg"}
                alt={"cpu"}
              />
            </Card.Section>
            <Text ta={"center"} fw={500}>
              پاور
            </Text>
          </Card>
        </Link>
      </Grid.Col>
      <Grid.Col span={4}></Grid.Col>
    </Grid>
  );
};

export default page;
