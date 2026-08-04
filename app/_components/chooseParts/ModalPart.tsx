import { CASE, IResult } from "@/_redux/services/caseApi";
import { CPU } from "@/_redux/services/cpuApi";
import { FAN } from "@/_redux/services/fanApi";
import { Graphic } from "@/_redux/services/graphicApi";
import { Motherboard } from "@/_redux/services/motherboardApi";
import { POWER } from "@/_redux/services/powerApi";
import { RAM } from "@/_redux/services/ramApi";
import { SSD } from "@/_redux/services/ssdApi";
import type { PartType, RecommendableProduct } from "@/_data/products/types";
import { Badge, Card, Modal, SimpleGrid, Skeleton, Text } from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import classes from "./choosePart.module.css";
import CardPartPrice from "../shared/CardPartPrice";
import { useRouter, useSearchParams } from "next/navigation";
import KiwiImage from "../shared/KiwiImage";
import { IconSparkles } from "@tabler/icons-react";

type Props = {
  opened: boolean;
  close: () => void;
  ssdList: { data: SSD[] | undefined; isSuccessSsdList: boolean };
  cpuList: {
    data: CPU[] | undefined;
    isSuccessCpuList: boolean;
    motherboardData: number[] | undefined;
    ramData: number[] | undefined;
  };
  ramList: {
    data: RAM[] | undefined;
    isSuccessRamList: boolean;
    motherboardData: number[] | undefined;
    cpuData: number[] | undefined;
  };
  caseList: { data: CASE[] | undefined; isSuccessCaseList: boolean };
  powerList: {
    data: POWER[] | undefined;
    isSuccessPowerList: boolean;
    graphicData: number[] | undefined;
  };
  graphicList: {
    data: Graphic[] | undefined;
    isSuccessGraphicList: boolean;
    cpuData: number[] | undefined;
    powerData: number[] | undefined;
  };
  fanList: {
    data: FAN[] | undefined;
    isSuccessFanList: boolean;
    cpuData: number[] | undefined;
  };
  motherboardList: {
    data: Motherboard[] | undefined;
    isSuccessMotherboardList: boolean;
    cpuData: number[] | undefined;
    ramData: number[] | undefined;
  };
  type: string;
};

type dataProp = RecommendableProduct & {
  name: string;
  id: number;
  price?: string;
  image: string;
  links: string;
};

const ModalPart: FC<Props> = ({
  opened,
  close,
  ssdList,
  cpuList,
  ramList,
  caseList,
  powerList,
  graphicList,
  fanList,
  motherboardList,
  type,
}) => {
  const [dataList, setDataList] = useState<dataProp[] | undefined>([]);
  const [modalTitle, setModalTitle] = useState("");

  const searchParams = useSearchParams();

  const cpuParam = searchParams.get("cpu");
  const motherboardParam = searchParams.get("motherboard");
  const ramParam = searchParams.get("ram");
  const graphicParam = searchParams.get("graphic");
  const powerParam = searchParams.get("power");
  const selectedPartIds: Partial<Record<PartType, number>> = {
    cpu: Number(cpuParam) || undefined,
    motherboard: Number(motherboardParam) || undefined,
    ram: Number(ramParam) || undefined,
    graphic: Number(graphicParam) || undefined,
    power: Number(powerParam) || undefined,
    fan: Number(searchParams.get("fan")) || undefined,
    ssd: Number(searchParams.get("ssd")) || undefined,
    case: Number(searchParams.get("case")) || undefined,
  };

  const isRecommended = (item: dataProp): boolean =>
    (Object.entries(item.recommendations ?? {}) as [PartType, number[]][]).some(
      ([partType, productIds]) => {
        const selectedId = selectedPartIds[partType];
        return selectedId !== undefined && productIds.includes(selectedId);
      },
    );

  const visibleData = dataList
    ? [...dataList].sort(
        (first, second) =>
          Number(isRecommended(second)) - Number(isRecommended(first)),
      )
    : undefined;
  useEffect(() => {
    if (opened) {
      setDataList([]);
    }
  }, [opened]);

  useEffect(() => {
    if (type)
      switch (type) {
        case "ssd":
          if (ssdList.isSuccessSsdList) setDataList(ssdList.data);
          setModalTitle("انتخاب ssd");
          break;
        case "cpu":
          if (motherboardParam && cpuList.motherboardData && cpuList.data) {
            setDataList(
              cpuList.data.filter((item) =>
                cpuList.motherboardData!.includes(item.id),
              ),
            );
          } else if (ramParam && cpuList.ramData && cpuList.data) {
            setDataList(
              cpuList.data.filter((item) => cpuList.ramData!.includes(item.id)),
            );
          } else if (cpuList.isSuccessCpuList) {
            setDataList(cpuList.data);
          }
          setModalTitle("انتخاب cpu");
          break;
        case "ram":
          if (motherboardParam && ramList.motherboardData && ramList.data) {
            setDataList(
              ramList.data.filter((item) =>
                ramList.motherboardData!.includes(item.id),
              ),
            );
          } else if (cpuParam && ramList.cpuData && ramList.data) {
            setDataList(
              ramList.data.filter((item) => ramList.cpuData!.includes(item.id)),
            );
          } else if (ramList.isSuccessRamList) {
            setDataList(ramList.data);
          }
          setModalTitle("انتخاب رم");
          break;
        case "case":
          if (caseList.isSuccessCaseList) setDataList(caseList.data);
          setModalTitle("انتخاب کیس");
          break;
        case "power":
          if (graphicParam && powerList.graphicData && powerList.data) {
            setDataList(
              powerList.data.filter((item) =>
                powerList.graphicData!.includes(item.id),
              ),
            );
          } else if (powerList.isSuccessPowerList) {
            setDataList(powerList.data);
          }

          setModalTitle("انتخاب پاور");
          break;
        case "graphic":
          if (cpuParam && graphicList.cpuData && graphicList.data) {
            setDataList(
              graphicList.data.filter((item) =>
                graphicList.cpuData!.includes(item.id),
              ),
            );
          } else if (powerParam && graphicList.powerData && graphicList.data) {
            setDataList(
              graphicList.data.filter((item) =>
                graphicList.powerData!.includes(item.id),
              ),
            );
          } else if (graphicList.isSuccessGraphicList) {
            setDataList(graphicList.data);
          }

          setModalTitle("انتخاب کارت گرافیک");
          break;
        case "fan":
          if (cpuParam && fanList.cpuData && fanList.data) {
            setDataList(
              fanList.data.filter((item) => fanList.cpuData!.includes(item.id)),
            );
          } else if (fanList.isSuccessFanList) setDataList(fanList.data);
          setModalTitle("انتخاب فن");
          break;
        case "motherboard":
          if (cpuParam && motherboardList.cpuData && motherboardList.data) {
            setDataList(
              motherboardList.data.filter((item) =>
                motherboardList.cpuData!.includes(item.id),
              ),
            );
          } else if (
            ramParam &&
            motherboardList.ramData &&
            motherboardList.data
          ) {
            setDataList(
              motherboardList.data.filter((item) =>
                motherboardList.ramData!.includes(item.id),
              ),
            );
          } else if (motherboardList.isSuccessMotherboardList) {
            setDataList(motherboardList.data);
          }
          setModalTitle("انتخاب مادربرد");
          break;
        default:
          break;
      }
  }, [
    type,
    cpuList,
    caseList,
    fanList,
    graphicList,
    powerList,
    ramList,
    ssdList,
    motherboardList,
    cpuParam,
    motherboardParam,
    ramParam,
    graphicParam,
    powerParam,
  ]);

  const router = useRouter();

  const handleCardClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, `${id}`);
    router.push(`/choose-part?${params.toString()}`);
    close();
  };

  return (
    <Modal size={"1000px"} opened={opened} onClose={close} title={modalTitle}>
      <SimpleGrid
        spacing="lg"
        verticalSpacing="lg"
        py={"lg"}
        cols={{ base: 2, lg: 4 }}
      >
        {visibleData && visibleData.length > 0
          ? visibleData.map((item) => {
              const recommended = isRecommended(item);

              return (
                <Card
                  onClick={() => handleCardClick(item.id)}
                  key={item.id}
                  pos="relative"
                  className={`${classes.partItem} ${recommended ? classes.recommendedPart : ""}`}
                >
                  {recommended && (
                    <Badge
                      className={classes.recommendationBadge}
                      leftSection={<IconSparkles size={12} stroke={2.2} />}
                      size="sm"
                      radius="sm"
                    >
                      پیشنهاد ویژه
                    </Badge>
                  )}
                  <Card.Section
                    className={classes.categoryImage}
                    mt={"0"}
                    ta={"center"}
                  >
                    {item.image && (
                      <KiwiImage
                        width={300}
                        height={300}
                        img={item.image}
                        alt={item.name}
                      />
                    )}
                  </Card.Section>

                  <Text ta={"center"} mt={"lg"} size="md">
                    {item.name}
                  </Text>
                  <CardPartPrice price={item.price} />
                </Card>
              );
            })
          : ""}
      </SimpleGrid>
      {dataList?.length === 0 && (
        <SimpleGrid
          spacing="lg"
          verticalSpacing="lg"
          py={"lg"}
          cols={{ base: 2, lg: 4 }}
        >
          <Skeleton height={260} mb="xl" />
          <Skeleton height={260} mb="xl" />
          <Skeleton height={260} mb="xl" />
          <Skeleton height={260} mb="xl" />
        </SimpleGrid>
      )}
    </Modal>
  );
};

export default ModalPart;
