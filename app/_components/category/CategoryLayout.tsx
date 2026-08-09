import {
  Grid,
  Card,
  Flex,
  Stack,
  Box,
  Divider,
  Group,
  Tooltip,
  Avatar,
  Text,
} from "@mantine/core";
import Link from "next/link";
import React, { FC } from "react";
import CardPartPrice from "../shared/CardPartPrice";
import classes from "./category.module.css";
import { CPU } from "@/_redux/services/cpuApi";
import { Graphic } from "@/_redux/services/graphicApi";
import { POWER } from "@/_redux/services/powerApi";
import { Motherboard } from "@/_redux/services/motherboardApi";
import { SSD } from "@/_redux/services/ssdApi";
import { FAN } from "@/_redux/services/fanApi";
import { CASE } from "@/_redux/services/caseApi";
import { RAM } from "@/_redux/services/ramApi";
import KiwiImage from "../shared/KiwiImage";
import ProductConditionBadge from "../shared/ProductConditionBadge";

type Props = {
  data: CPU | Motherboard | Graphic | POWER | SSD | FAN | CASE | RAM;
  type:
    | "powers"
    | "cpus"
    | "motherboards"
    | "graphics"
    | "ssds"
    | "fans"
    | "cases"
    | "rams";
  children: React.ReactNode;
};
const CategoryLayout: FC<Props> = ({ data, children, type }) => {
  return (
    <Grid.Col key={data.id} span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
      <Card
        className={classes.categoryCard}
        mih={{ base: "230px", sm: "375px" }}
        miw={"250px"}
        key={data.id}
        padding="lg"
        radius="md"
        withBorder
      >
        <Link
          className={classes.categorySection}
          href={`/products/${type}/${data.id}`}
        >
          <ProductConditionBadge condition={data.condition} />
          <Card.Section
            className={classes.categoryImage}
            mt={"0"}
            ta={"center"}
          >
            {data.image && (
              <KiwiImage
                width={300}
                height={300}
                img={data.image}
                alt={data.name}
              />
            )}
          </Card.Section>

          <Flex direction={"column"}>
            <Stack
              h={{ md: 55 }}
              justify="start"
              align="center"
              mt="md"
              mb="xs"
            >
              <Text
                lineClamp={2}
                pt={{ base: "md", md: "xs" }}
                className={classes.ProductTitle}
                fw={500}
              >
                {data.name}
              </Text>
            </Stack>
            <CardPartPrice price={data.price} />
          </Flex>
        </Link>
        {children}
      </Card>
    </Grid.Col>
  );
};

export default CategoryLayout;
