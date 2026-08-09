import { Grid, Flex, Group, Button, Text } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import classes from "@/_cssModules/PcSection.module.css";
import React from "react";
import TabsSection from "./components/TabsSection";
import { RAM } from "@/_redux/services/ramApi";
import SingleProductImage from "./components/SingleProductImage";
import LinksProducts from "./LinksProducts";

const RamSingle = ({ product }: { product: RAM }) => {
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
              فرکانس :‌
            </Text>
            <Text mr={"3px"}>{product.frequency} </Text>
          </Flex>
          <Flex mt={"xl"}>
            {/* <Text fz={'16px'} c="dimmed">نورپردازی : ‌</Text>
                        <Text mr={'1px'}>{product.rgb ? <IconCheck /> : <IconX size={15} />} </Text> */}
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
      <TabsSection
        defaultValue="cpus"
        tabLists={[
          { title: "پردازنده‌های مطابق", img: "/svg/cpu.svg", value: "cpus" },
          {
            title: "مادربردهای مطابق",
            img: "/svg/motherboard.svg",
            value: "motherboards",
          },
        ]}
        tabPanels={[
          { value: "cpus", item: product.cpus },
          { value: "motherboards", item: product.motherboards },
        ]}
      />
    </>
  );
};

export default RamSingle;
