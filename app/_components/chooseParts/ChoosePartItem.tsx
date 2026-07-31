import { Box, Tooltip, Text, Divider, Flex, ActionIcon } from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import classes from "./choosePart.module.css";
import { useDisclosure } from "@mantine/hooks";
import CardPartPrice from "../shared/CardPartPrice";
import { CPU } from "@/_redux/services/cpuApi";
import ShopsLink from "../pieces/shared/ShopsLink";
import { IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import KiwiImage from "../shared/KiwiImage";

interface Props {
  svg: string;
  title: string;
  type: string;
  itemData?: Partial<CPU>;
  partEmpty: boolean;
}

const ChoosePartItem: FC<Props> = ({
  svg,
  title,
  type,
  itemData,
  partEmpty,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentItemData, setCurrentItemData] = useState<
    Partial<CPU> | undefined
  >(itemData);

  useEffect(() => {
    if (itemData) {
      setCurrentItemData(itemData);
    }
  }, [itemData, partEmpty]);

  const [opened, { open, close }] = useDisclosure(false);

  const removeSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.delete(type); // Remove the type parameter
    params.delete(`${itemData?.id}`); // Remove the id parameter
    if (type === "cpu") {
      params.delete("motherboard");
    }

    router.push(`/choose-part?${params.toString()}`);
    setCurrentItemData(undefined); // Clear the item data
  };

  useEffect(() => {
    if (partEmpty) {
      setCurrentItemData(undefined); // Clear the item data
    }
  }, [partEmpty]);
  return (
    <>
      {currentItemData ? (
        <>
          <Box
            pos={"relative"}
            bg={"var(--mantine-color-body)"}
            w={{ base: "175px", lg: "255px" }}
            pt={"20px"}
            style={{ borderRadius: "10px" }}
            component="div"
            className={`${classes.box}`}
            mt={"0"}
            ta={"center"}
          >
            <ActionIcon
              onClick={removeSelected}
              className={classes.closeButton}
              pos={"absolute"}
              variant="light"
              color="rgba(180, 220, 240, 0.98)"
              style={{
                position: "absolute",
                left: "4px",
                top: "5px",
                cursor: "pointer",
                zIndex: "2",
              }}
            >
              <IconX size={18} />
            </ActionIcon>
            <Box w={"100%"} ta={"center"} className={classes.categoryImage}>
              {currentItemData.image && (
                <KiwiImage
                  width={300}
                  height={300}
                  img={currentItemData.image}
                  alt={currentItemData.name ?? ""}
                />
              )}
            </Box>
            <Text lineClamp={2} h={"43px"} ta={"center"} mt={"lg"} size="sm">
              {currentItemData.name}
            </Text>
            <Flex justify={"center"} align={"center"}>
              <CardPartPrice justify="center" price={currentItemData.price} />
            </Flex>
            <Divider mt={"xl"} />
            <ShopsLink justIcon={true} currentPiece={currentItemData} />
          </Box>
        </>
      ) : (
        <Tooltip label={title}>
          <Box
            ta={"center"}
            w={{ base: "175px", lg: "255px" }}
            onClick={open}
            bg={"var(--mantine-color-body)"}
            className={classes.box}
            py={"50px"}
            style={{ borderRadius: "10px" }}
            component="div"
          >
            <Image width={110} height={100} src={svg} alt={title} />
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default ChoosePartItem;
