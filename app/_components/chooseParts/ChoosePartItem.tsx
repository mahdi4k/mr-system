import {
  Box,
  Tooltip,
  Text,
  Divider,
  Flex,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import React, { FC } from "react";
import Image from "next/image";
import classes from "./choosePart.module.css";
import { useDisclosure } from "@mantine/hooks";
import CardPartPrice from "../shared/CardPartPrice";
import { CPU } from "@/_redux/services/cpuApi";
import ShopsLink from "../pieces/shared/ShopsLink";
import { IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import KiwiImage from "../shared/KiwiImage";
import ProductConditionBadge from "../shared/ProductConditionBadge";
import { parseRamQuantity } from "@/_utils/pcAssistant";

interface Props {
  svg: string;
  title: string;
  type: string;
  itemData?: Partial<CPU>;
  partEmpty: boolean;
  loading?: boolean;
}

const ChoosePartItem: FC<Props> = ({
  svg,
  title,
  type,
  itemData,
  partEmpty,
  loading = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ramQuantity = parseRamQuantity(searchParams.get("ramQuantity"));

  const [opened, { open }] = useDisclosure(false);

  // Derive display directly from props — RTK Query cache keeps removed
  // items around, so partEmpty must always win over a stale itemData.
  const currentItemData = partEmpty ? undefined : itemData;

  const removeSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.delete(type); // Remove the type parameter
    params.delete(`${itemData?.id}`); // Remove the id parameter
    if (type === "cpu") {
      params.delete("motherboard");
    }
    if (type === "ram") {
      params.delete("ramQuantity");
    }

    router.push(`/choose-part?${params.toString()}`);
  };

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
            <ProductConditionBadge
              condition={currentItemData.condition}
              className={classes.conditionBadge}
            />
            <Box w={"100%"} ta={"center"} className={classes.categoryImage}>
              {currentItemData.image && (
                <KiwiImage
                  width={300}
                  height={300}
                  img={currentItemData.image}
                  fallbackSrc={
                    currentItemData.staticImage !== currentItemData.image
                      ? currentItemData.staticImage
                      : undefined
                  }
                  alt={currentItemData.name ?? ""}
                />
              )}
            </Box>
            <Text lineClamp={2} h={"43px"} ta={"center"} mt={"lg"} size="sm">
              {type === "ram" ? `${ramQuantity}x ` : ""}
              {currentItemData.name}
            </Text>
            <Flex justify={"center"} align={"center"}>
              <CardPartPrice
                justify="center"
                price={
                  type === "ram" && currentItemData.price
                    ? String(Number(currentItemData.price) * ramQuantity)
                    : currentItemData.price
                }
              />
            </Flex>
            <Divider mt={"xl"} />
            <ShopsLink justIcon={true} currentPiece={currentItemData} />
          </Box>
        </>
      ) : loading ? (
        <Box
          w={{ base: "175px", lg: "255px" }}
          bg={"var(--mantine-color-body)"}
          className={classes.box}
          p={"20px"}
          style={{ borderRadius: "10px" }}
          component="div"
        >
          <Skeleton height={110} radius="sm" mb="lg" />
          <Skeleton height={14} radius="sm" mb="xs" />
          <Skeleton height={14} width="60%" radius="sm" mx="auto" />
        </Box>
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
            <Image
              width={110}
              height={100}
              src={svg}
              alt={title}
              loading={type === "cpu" ? "eager" : "lazy"}
            />
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default ChoosePartItem;
