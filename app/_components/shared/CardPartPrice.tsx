import { Group, MantineSpacing, StyleProp, Text } from "@mantine/core";
import React from "react";
import Image from "next/image";
import classes from "../category/category.module.css";
const CardPartPrice = ({
  price,
  justify,
  isAds,
  tomanWidth,
  tomanHeight,
  textSize,
  mt,
  mb,
}: {
  mt?: StyleProp<MantineSpacing>;
  mb?: StyleProp<MantineSpacing>;
  price: string | undefined;
  justify?: string;
  isAds?: boolean;
  tomanWidth?: number;
  tomanHeight?: number;
  textSize?: any;
}) => {
  return (
    <>
      {price ? (
        <>
          <Group
            justify={justify}
            gap={4}
            className={classes.Price}
            align="center"
            mt={mt ? mt : "md"}
            mb={mb ? mb : "xs"}
          >
            <Text
              hidden={isAds}
              className={classes.PriceProductTitle}
              fw={"bold"}
              c="#25ac9e"
            >
              از
            </Text>
            <Text
              fz={textSize}
              className={classes.PriceProductTitle}
              fw={"bold"}
              c="#25ac9e"
            >
              {Intl.NumberFormat("fa", {}).format(Number(price))}
            </Text>
            <Image
              src={"/svg/toman.svg"}
              alt="kiwi part price"
              width={tomanWidth ? tomanWidth : 22}
              height={tomanHeight ? tomanHeight : 22}
            />
          </Group>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CardPartPrice;
