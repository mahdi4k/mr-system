import { POWER } from "@/_redux/services/powerApi";
import {
  Container,
  Grid,
  Flex,
  Group,
  Button,
  Tabs,
  Card,
  Stack,
  Badge,
  Text,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import classes from "@/_cssModules/PcSection.module.css";
import React from "react";
import CardPartPrice from "../shared/CardPartPrice";
import TabsSection from "./components/TabsSection";
import SingleProductImage from "./components/SingleProductImage";
import LinksProducts from "./LinksProducts";

const PowerSingle = ({ product }: { product: POWER }) => {
  return (
    <>
      <Grid mt={"xl"}>
        <SingleProductImage product={product} />

        <Grid.Col pr={{ base: "xs", lg: "xl" }} span={{ base: 12, lg: 8 }}>
          <Text fz={{ base: "18pt", lg: "28pt" }} fw={"bold"}>
            {" "}
            {product.name}
          </Text>
          <Flex mt={"xl"}>
            <Text fz={"16px"} c="dimmed">
              توان حقیقی :‌
            </Text>
            <Text mr={"3px"}>{product.psu} وات</Text>
          </Flex>
          <Flex mt={"xl"}>
            <Text fz={"16px"} c="dimmed">
              نوع کابل کشی خروجی:‌
            </Text>
            <Text mr={"3px"}>
              {product.modular === 1
                ? "غیر ماژولار"
                : product.modular === 2
                  ? "نیمه ماژولار"
                  : product.modular === 3
                    ? "کاملا ماژولار"
                    : ""}{" "}
            </Text>
          </Flex>

          {product.price ? (
            <>
              <Group gap={3} justify="end" align="center" mt="lg" mb="xs">
                <Text ml={"2px"}>از</Text>
                <Text fz={"1.3rem"} fw={"bold"}>
                  {Intl.NumberFormat("fa", {}).format(Number(product.price))}
                </Text>
                <Image
                  className={classes.tomanIcon}
                  src={"/svg/toman.svg"}
                  alt="kiwi part price"
                  width={16}
                  height={16}
                />
              </Group>
            </>
          ) : (
            ""
          )}
          <LinksProducts links={product.links} />
        </Grid.Col>
      </Grid>

      {/* tab section */}
      {product && (
        <TabsSection
          defaultValue="graphics"
          tabLists={[
            {
              title: "کارت گرافیک مطابق",
              img: "/svg/graphic.svg",
              value: "graphics",
            },
          ]}
          tabPanels={[{ value: "graphics", item: product.graphics }]}
        />
      )}
    </>
  );
};

export default PowerSingle;
