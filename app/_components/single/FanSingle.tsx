import { Grid, Flex, Group, Button, Text } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import classes from "@/_cssModules/PcSection.module.css";
import React from "react";
import TabsSection from "./components/TabsSection";
import { FAN } from "@/_redux/services/fanApi";
import { IconCheck, IconX } from "@tabler/icons-react";
import SingleProductImage from "./components/SingleProductImage";
import LinksProducts from "./LinksProducts";

const FanSingle = ({ product }: { product: FAN }) => {
  const torobLink = JSON.parse(product.links)[0];
  const EmallsLink = JSON.parse(product.links)[1];

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
              فن نویز : ‌
            </Text>
            <Text mr={"1px"}>{product.fan_noise} </Text>
          </Flex>

          <Flex mt={"xl"}>
            <Text fz={"16px"} c="dimmed">
              هیت سینک : ‌
            </Text>
            <Text mr={"1px"}>{product.heat_sink_material} </Text>
          </Flex>

          <Flex mt={"xl"}>
            <Text fz={"16px"} c="dimmed">
              نورپردازی : ‌
            </Text>
            <Text mr={"1px"}>
              {product.rgb ? <IconCheck /> : <IconX size={15} />}{" "}
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
          <LinksProducts EmallsLink={EmallsLink} torobLink={torobLink} />
        </Grid.Col>
      </Grid>

      {/* tab section */}
      {product && (
        <TabsSection
          defaultValue="cpus"
          tabLists={[
            { title: "cpu مطابق", img: "/svg/cpu.svg", value: "cpus" },
          ]}
          tabPanels={[{ value: "cpus", item: product.cpus }]}
        />
      )}
    </>
  );
};

export default FanSingle;
