"use client";

import React, { FC, useEffect, useState } from "react";
import classes from "./pieces.module.css";
import {
  Badge,
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/_redux/store";
import { ObjectIsEmpty } from "@/_utils/utils";
import {
  IconBuildingStore,
  IconExclamationCircle,
  IconListDetails,
  IconX,
} from "@tabler/icons-react";
import useLoading from "@/_utils/customHook/useLoading";
import { Graphic } from "@/_redux/services/graphicApi";
import { POWER, useGetPowersQuery } from "@/_redux/services/powerApi";
import { addselectedPower, relatedGraphicList } from "@/_redux/features/power";
import Link from "next/link";
import ShopsLink from "./shared/ShopsLink";

export type IPowerProps = {
  setActivePower: React.Dispatch<
    React.SetStateAction<Partial<POWER> | undefined>
  >;
  activePower: Partial<Graphic> | undefined;
};
const Power: FC<IPowerProps> = ({ setActivePower, activePower }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [powerSelected, setSelectedPower] = useState<POWER[]>();
  const dispatch = useDispatch();
  const loadingEnd = useLoading();

  const powerListFromSelectedGraphic = useSelector(
    (state: RootState) => state.graphic.relatedPowers,
  );
  const { isSuccess, data = [], error } = useGetPowersQuery({});
  const currentPower = useSelector(
    (state: RootState) => state.power.selectedPower,
  );
  const selectedGraphic = useSelector(
    (state: RootState) => state.graphic.selectedGraphic,
  );
  useEffect(() => {
    if (loadingEnd) {
      setActivePower(currentPower);
    }
  }, [loadingEnd, currentPower]);
  const selectedPower = (id: number) => {
    const power = data.find((el) => el.id === id);
    if (power) {
      dispatch(addselectedPower(power));
      relatedGraphic(power);
    }
    close();
  };

  const relatedGraphic = (power: POWER) => {
    dispatch(relatedGraphicList(power.graphics));
  };

  const removeSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addselectedPower({}));
    dispatch(relatedGraphicList([]));
  };
  const titleDrawer = () => {
    return ObjectIsEmpty(selectedGraphic) ? (
      "لیست پاور"
    ) : (
      <Flex align={"center"} justify={"center"}>
        لیست پاور سازگار با کارت گرافیک
        <Text mr={"sm"} fw={"bolder"}>
          {" "}
          {selectedGraphic.name}
        </Text>
      </Flex>
    );
  };
  useEffect(() => {
    setSelectedPower(
      powerListFromSelectedGraphic.length ? powerListFromSelectedGraphic : data,
    );
  }, [powerListFromSelectedGraphic, isSuccess]);

  return (
    <>
      <div
        onClick={open}
        className={`${classes.pieces} ${cardClasses.cardMain}`}
      >
        {ObjectIsEmpty(currentPower) ? (
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
              پاور
            </Text>
            <Image
              style={{ bottom: "5px" }}
              className={classes.piecesImg}
              width={100}
              height={100}
              src={"/svg/power.svg"}
              alt={"power"}
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
              {currentPower.image && (
                <Image
                  alt={currentPower.name ? currentPower.name : ""}
                  width={75}
                  height={85}
                  src={currentPower.image}
                />
              )}
            </Card.Section>
            <Flex
              direction={"column"}
              justify="center"
              align={"center"}
              mb="xs"
            >
              <Text ta={"center"} fz={"sm"} mt={"xs"}>
                {currentPower.name}
              </Text>
            </Flex>
            {currentPower.price ? (
              <>
                <Group gap={3} justify="center" align="center" mb="xs">
                  <Text fz={"xs"} ml={"2px"}>
                    از
                  </Text>
                  <Text fz={"xs"} fw={"bold"}>
                    {Intl.NumberFormat("fa", {}).format(
                      Number(currentPower.price),
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

        {ObjectIsEmpty(currentPower) ? (
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
                  <Text fz={"sm"}>توان حقیقی</Text>
                </Grid.Col>
                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fw={"bold"} fz={"sm"}>
                    {currentPower.psu} وات
                  </Text>
                </Grid.Col>

                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fz={"sm"}>نوع کابل کشی خروجی</Text>
                </Grid.Col>
                <Grid.Col className={classes.borderBottomDashed} span={6}>
                  <Text fw={"bold"} fz={"sm"}>
                    {" "}
                    {currentPower.modular === 1
                      ? "غیر ماژولار"
                      : currentPower.modular === 2
                        ? "نیمه ماژولار"
                        : currentPower.modular === 3
                          ? "کاملا ماژولار"
                          : ""}
                  </Text>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="shop">
              <ShopsLink currentPiece={currentPower} />
            </Tabs.Panel>
          </Tabs>
        )}
      </div>
      <Drawer
        position={"bottom"}
        opened={opened}
        onClose={close}
        title={titleDrawer()}
      >
        <Grid pb={"xl"}>
          {powerSelected?.map((el) => (
            <Grid.Col key={el.id} span={{ base: 6, sm: 4, md: 2 }}>
              <Card
                onClick={() => selectedPower(el.id)}
                key={el.id}
                className={cardClasses.hoverCard}
                style={{ padding: "0 20px" }}
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

export default Power;
