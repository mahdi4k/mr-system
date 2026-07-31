"use client";
import React from "react";
import {
  Text,
  Title,
  TextInput,
  Button,
  Group,
  Flex,
  Container,
  Stack,
} from "@mantine/core";
import classes from "@/_cssModules/PcSection.module.css";
import Image from "next/image";
import { IconArrowsExchange } from "@tabler/icons-react";
import Link from "next/link";

const GraphicPower = () => {
  return (
    <Container size="lg">
      <Stack className={`${classes.wrapper} ${classes.flexColumn}`}>
        <Link className={classes.image} href={"/pieces/graphic/power"}>
          <Image
            fill
            alt="graphic card vs cpu"
            src={"/svg/graphic-power.svg"}
          />
        </Link>
        <Group justify="center" mb={"md"} align={"center"}>
          <Title order={3} fs={"italic"} className={classes.title}>
            کارت گرافیک
          </Title>
          <IconArrowsExchange />
          <Title order={3} className={classes.title} fs={"italic"}>
            پاور
          </Title>
        </Group>
      </Stack>
    </Container>
  );
};

export default GraphicPower;
