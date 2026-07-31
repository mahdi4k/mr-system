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

const CpuGraphic = () => {
  return (
    <Container my={"xl"} size="lg">
      <Stack>
        <Link className={classes.image} href={"/pieces/graphic/cpu"}>
          <Image fill alt="graphic card vs cpu" src={"/svg/cpu-graphic.svg"} />
        </Link>
        <Group mb={"md"} justify="center" align={"center"}>
          <Title order={3} fs={"italic"} className={classes.title}>
            CPU
          </Title>
          <IconArrowsExchange />
          <Title order={3} className={classes.title} fs={"italic"}>
            کارت گرافیک
          </Title>
        </Group>
      </Stack>
    </Container>
  );
};

export default CpuGraphic;
