import { Graphic } from "@/_redux/services/graphicApi";
import { Button, Flex, Grid, Group, Text } from "@mantine/core";
import React from "react";
import Image from "next/image";
import classes from "@/_cssModules/PcSection.module.css";
import Link from "next/link";
import TabsSection from "./components/TabsSection";
import SingleProductImage from "./components/SingleProductImage";
import LinksProducts from "./LinksProducts";

const GraphicCardSingle = ({ product }: { product: Graphic }) => {
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
              سازنده پردازنده گرافیکی :‌
            </Text>
            <Text mr={"3px"}>{product.manufacturer}</Text>
          </Flex>
          <Flex mt={"xl"}>
            <Text fz={"16px"} c="dimmed">
              حداقل پاور پیشنهادی :‌
            </Text>
            <Text mr={"3px"}>{product.psu} وات</Text>
          </Flex>
          <Flex mt={"xl"}>
            <Text fz={"16px"} c="dimmed">
              نوع حافظه :‌
            </Text>
            <Text mr={"3px"}>{product.type}</Text>
          </Flex>
          <Flex mt={"xl"}>
            <Text fz={"16px"} c="dimmed">
              میزان حافظه :‌
            </Text>
            <Text mr={"3px"}>{product.ram} گیگابایت</Text>
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
          defaultValue="powers"
          tabLists={[
            { title: "پاورهای مطابق", img: "/svg/power.svg", value: "powers" },
            { title: "cpu مطابق", img: "/svg/cpu.svg", value: "cpus" },
          ]}
          tabPanels={[
            { value: "powers", item: product.powers },
            { value: "cpus", item: product.cpus },
          ]}
        />
      )}
    </>
  );
};

export default GraphicCardSingle;
