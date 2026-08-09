"use client";

import React, { FC, useEffect, useState } from "react";
import classes from "./pieces.module.css";
import {
  Badge,
  Box,
  Button,
  Card,
  Drawer,
  Flex,
  Grid,
  Group,
  Tabs,
  Text,
  Tooltip,
} from "@mantine/core";
import Image from "next/image";
import cardClasses from "../cardService/cardService.module.css";
import { useDisclosure } from "@mantine/hooks";
import { CPU } from "@/_redux/services/cpuApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addselectedCpu,
  relatedGraphicList,
  relatedMotherboardList,
} from "@/_redux/features/cpu";
import { RootState } from "@/_redux/store";
import { ObjectIsEmpty } from "@/_utils/utils";
import {
  IconBuildingStore,
  IconExclamationCircle,
  IconListDetails,
  IconX,
} from "@tabler/icons-react";
import useLoading from "@/_utils/customHook/useLoading";
import { Graphic, useGetGraphicsQuery } from "@/_redux/services/graphicApi";
import {
  addselectedGraphic,
  relatedCpuList,
  relatedPowerList,
} from "@/_redux/features/graphic";
import Link from "next/link";
import ShopsLink from "./shared/ShopsLink";

export type IgraphicProps = {
  setActiveGraphic: React.Dispatch<
    React.SetStateAction<Partial<Graphic> | undefined>
  >;
  activeGraphic: Partial<Graphic> | undefined;
};
const GraphicCard: FC<IgraphicProps> = ({
  setActiveGraphic,
  activeGraphic,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [graphicSelected, setSelectedGraphic] = useState<Graphic[]>();
  const dispatch = useDispatch();
  const loadingEnd = useLoading();

  const graphicListFromSelectedCpu = useSelector(
    (state: RootState) => state.cpu.relatedGraphic,
  );
  const graphicListFromSelectedPower = useSelector(
    (state: RootState) => state.power.relatedGraphic,
  );
  const { isSuccess, data = [], error } = useGetGraphicsQuery({});
  const currentGraphic = useSelector(
    (state: RootState) => state.graphic.selectedGraphic,
  );
  const selectedPower = useSelector(
    (state: RootState) => state.power.selectedPower,
  );
  useEffect(() => {
    if (loadingEnd) {
      setActiveGraphic(currentGraphic);
    }
  }, [loadingEnd, currentGraphic]);
  const selectedGraphic = (id: number) => {
    const graphic = data.find((el) => el.id === id);
    if (graphic) {
      dispatch(addselectedGraphic(graphic));
      relatedCpu(graphic);
      relatedPower(graphic);
    }
    close();
  };

  const relatedCpu = (graphic: Graphic) => {
    dispatch(relatedCpuList(graphic.cpus));
  };

  const relatedPower = (graphic: Graphic) => {
    dispatch(relatedPowerList(graphic.powers));
  };

  const removeSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addselectedGraphic({}));
    dispatch(relatedMotherboardList([]));
    dispatch(relatedGraphicList([]));
    dispatch(relatedPowerList([]));
  };
  const titleDrawer = () => {
    return ObjectIsEmpty(selectedPower) ? (
      "لیست کارت گرافیک"
    ) : (
      <Flex align={"center"} justify={"center"}>
        <Text fz={"sm"}> لیست cpu سازگار با مادربرد</Text>
        <Text fz={"xs"} mr={"sm"} fw={"bolder"}>
          {" "}
          {selectedPower.name}
        </Text>
      </Flex>
    );
  };
  useEffect(() => {
    setSelectedGraphic(
      graphicListFromSelectedCpu.length
        ? data.filter((graphic) =>
            graphicListFromSelectedCpu.includes(graphic.id),
          )
        : data,
    );
  }, [graphicListFromSelectedCpu, isSuccess]);

  useEffect(() => {
    setSelectedGraphic(
      graphicListFromSelectedPower.length
        ? data.filter((graphic) =>
            graphicListFromSelectedPower.includes(graphic.id),
          )
        : data,
    );
  }, [graphicListFromSelectedPower, isSuccess]);

  useEffect(() => {
    return () => {
      dispatch(addselectedGraphic({}));
      dispatch(relatedMotherboardList([]));
      dispatch(relatedGraphicList([]));
    };
  }, []);

  return (
    <>
      <Box
        component="div"
        mb={"xl"}
        onClick={open}
        className={`${classes.pieces} ${cardClasses.cardMain}`}
      >
        {ObjectIsEmpty(currentGraphic) ? (
          <Flex
            className={classes.hoverCard}
            mb={"lg"}
            align={"center"}
            justify={"center"}
            direction={"column"}
          >
            <Text className={classes.disableText} ta={"center"} fz={"xl"}>
              انتخاب
            </Text>
            <Text className={classes.disableText} fw={"bold"}>
              کارت گرافیک
            </Text>
            <Image
              className={classes.piecesImg}
              width={110}
              height={60}
              src={"/svg/graphic.svg"}
              alt={"cpu"}
            />
          </Flex>
        ) : (
          <Card
            style={{ padding: "0 35px", marginTop: "20px", width: "200px" }}
            radius="md"
            shadow="xs"
          >
            <IconX
              onClick={removeSelected}
              size={18}
              style={{ position: "absolute", right: "4px", top: "3px" }}
            />
            <Card.Section style={{ textAlign: "center" }} mt={"md"}>
              {currentGraphic.image && (
                <Image
                  alt={currentGraphic.name ? currentGraphic.name : ""}
                  width={80}
                  height={80}
                  src={currentGraphic.image}
                />
              )}
            </Card.Section>
            <Flex
              direction={"column"}
              justify="center"
              align={"center"}
              mb="xs"
            >
              <Text ta={"center"} fz={"sm"} mt={"sm"}>
                {currentGraphic.name}
              </Text>
            </Flex>
            {currentGraphic.price ? (
              <>
                <Group gap={3} justify="center" align="center" mb="xs">
                  <Text fz={"xs"} ml={"2px"}>
                    از
                  </Text>
                  <Text fz={"xs"} fw={"bold"}>
                    {Intl.NumberFormat("fa", {}).format(
                      Number(currentGraphic.price),
                    )}
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
          </Card>
        )}

        {ObjectIsEmpty(currentGraphic) ? (
          ""
        ) : (
          <Tabs
            w={"100%"}
            onClick={(e) => e.stopPropagation()}
            className={classes.tabSection}
            defaultValue="info"
          >
            <Tabs.List>
              <Tabs.Tab
                value="info"
                rightSection={<IconListDetails size={18} />}
              >
                مشخصات
              </Tabs.Tab>
              <Tabs.Tab
                value="shop"
                rightSection={<IconBuildingStore size={18} />}
              >
                فروشگاه
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="info">
              <Grid my={"md"}>
                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fz={"sm"}>سازنده پردازنده گرافیکی</Text>
                </Grid.Col>
                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fw={"bold"} fz={"sm"}>
                    {currentGraphic.manufacturer}
                  </Text>
                </Grid.Col>

                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fz={"sm"}>حداقل پاور پیشنهادی</Text>
                </Grid.Col>
                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fw={"bold"} fz={"sm"}>
                    {currentGraphic.psu} وات
                  </Text>
                </Grid.Col>

                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fz={"sm"}>نوع حافظه</Text>
                </Grid.Col>
                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fw={"bold"} fz={"sm"}>
                    {currentGraphic.type}{" "}
                  </Text>
                </Grid.Col>

                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fz={"sm"}>میزان حافظه</Text>
                </Grid.Col>
                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fw={"bold"} fz={"sm"}>
                    {currentGraphic.ram} گیگابایت{" "}
                  </Text>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="shop">
              <ShopsLink currentPiece={currentGraphic} />
            </Tabs.Panel>
          </Tabs>
        )}
      </Box>
      <Drawer
        position={"bottom"}
        opened={opened}
        onClose={close}
        title={titleDrawer()}
      >
        <Grid pb={"xl"}>
          {graphicSelected?.map((el) => (
            <Grid.Col key={el.id} span={{ base: 6, sm: 4, md: 2 }}>
              <Card
                h={230}
                onClick={() => selectedGraphic(el.id)}
                key={el.id}
                className={cardClasses.hoverCard}
                style={{ padding: "0 25x" }}
                radius="md"
                withBorder
              >
                <Card.Section style={{ textAlign: "center" }} mt={"md"}>
                  {el.image && (
                    <Image
                      alt={el.name}
                      width={80}
                      height={80}
                      src={`${el.image}`}
                    />
                  )}
                </Card.Section>

                <Flex
                  direction={"column"}
                  justify="center"
                  align={"center"}
                  mt="sm"
                  mb="xs"
                >
                  <Text ta={"center"} fz={"sm"}>
                    {el.name}
                  </Text>
                </Flex>
                {el.price ? (
                  <>
                    <Group gap={3} justify="center" align="center" mb="xs">
                      <Text fz={"xs"} ml={"2px"}>
                        از
                      </Text>
                      <Text fz={"xs"} fw={"bold"}>
                        {Intl.NumberFormat("fa", {}).format(Number(el.price))}
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
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Drawer>
    </>
  );
};

export default GraphicCard;
