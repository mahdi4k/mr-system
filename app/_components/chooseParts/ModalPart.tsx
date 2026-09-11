import { CASE, IResult } from "@/_redux/services/caseApi";
import { CPU } from "@/_redux/services/cpuApi";
import { FAN } from "@/_redux/services/fanApi";
import { Graphic } from "@/_redux/services/graphicApi";
import { Motherboard } from "@/_redux/services/motherboardApi";
import { POWER } from "@/_redux/services/powerApi";
import { RAM } from "@/_redux/services/ramApi";
import { SSD } from "@/_redux/services/ssdApi";
import type { PartType, RecommendableProduct } from "@/_data/products/types";
import {
  getCase,
  getCpu,
  getFan,
  getGraphic,
  getMotherboard,
  getPower,
  getRam,
  getSsd,
} from "@/_data/productCatalog";
import { filterAndSortParts, type PartSort } from "@/_utils/partFilters";
import {
  type BuildPartType,
  type BuildProduct,
  RAM_QUANTITIES,
  calculatePsuRequirement,
  isPartialBuildCompatible,
  parseRamQuantity,
} from "@/_utils/pcAssistant";
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import classes from "./choosePart.module.css";
import CardPartPrice from "../shared/CardPartPrice";
import { useRouter, useSearchParams } from "next/navigation";
import KiwiImage from "../shared/KiwiImage";
import {
  IconArrowsSort,
  IconBolt,
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react";
import ProductConditionBadge from "../shared/ProductConditionBadge";

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
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [sort, setSort] = useState<PartSort>("price-asc");
  const [ramQuantities, setRamQuantities] = useState<Record<number, number>>(
    {},
  );

  const searchParams = useSearchParams();

  const cpuParam = searchParams.get("cpu");
  const motherboardParam = searchParams.get("motherboard");
  const ramParam = searchParams.get("ram");
  const graphicParam = searchParams.get("graphic");
  const powerParam = searchParams.get("power");
  const fanParam = searchParams.get("fan");
  const ssdParam = searchParams.get("ssd");
  const caseParam = searchParams.get("case");
  const ramQuantity = parseRamQuantity(searchParams.get("ramQuantity"));
  const selectedPartIds: Partial<Record<PartType, number>> = {
    cpu: Number(cpuParam) || undefined,
    motherboard: Number(motherboardParam) || undefined,
    ram: Number(ramParam) || undefined,
    graphic: Number(graphicParam) || undefined,
    power: Number(powerParam) || undefined,
    fan: Number(fanParam) || undefined,
    ssd: Number(ssdParam) || undefined,
    case: Number(caseParam) || undefined,
  };
  const selectedCpu = cpuParam ? getCpu(cpuParam) : undefined;
  const selectedGraphic = graphicParam ? getGraphic(graphicParam) : undefined;
  const selectedFan = fanParam ? getFan(fanParam) : undefined;
  const selectedRam = ramParam ? getRam(ramParam) : undefined;
  const psuCalculation = calculatePsuRequirement({
    cpu: selectedCpu,
    graphic: selectedGraphic,
    fan: selectedFan,
  });
  const suggestedPowerW = psuCalculation
    ? Math.min(
        ...(powerList.data ?? [])
          .map((item) => Number(item.psu))
          .filter(
            (wattage) =>
              Number.isFinite(wattage) &&
              wattage >= psuCalculation.recommendedPsuW,
          ),
      )
    : undefined;

  const isRecommended = (item: dataProp): boolean => {
    if (type === "power" && suggestedPowerW != null && "psu" in item) {
      return Number(item.psu) === suggestedPowerW;
    }

    return (
      Object.entries(item.recommendations ?? {}) as [PartType, number[]][]
    ).some(([partType, productIds]) => {
      const selectedId = selectedPartIds[partType];
      return selectedId !== undefined && productIds.includes(selectedId);
    });
  };

  const selectedProductName = dataList?.find(
    (item) => String(item.id) === selectedProductId,
  )?.name;
  const visibleData = dataList
    ? filterAndSortParts(
        dataList,
        selectedProductName ?? "",
        sort,
        isRecommended,
      )
    : undefined;
  useEffect(() => {
    if (opened) {
      setDataList([]);
      setSelectedProductId(null);
      setSort("price-asc");
      setRamQuantities(ramParam ? { [Number(ramParam)]: ramQuantity } : {});
    }
  }, [opened, ramQuantity]);

  useEffect(() => {
    const selectedBuild: Partial<Record<BuildPartType, BuildProduct>> = {
      cpu: cpuParam ? getCpu(cpuParam) : undefined,
      motherboard: motherboardParam
        ? getMotherboard(motherboardParam)
        : undefined,
      ram: selectedRam ? { ...selectedRam, quantity: ramQuantity } : undefined,
      graphic: graphicParam ? getGraphic(graphicParam) : undefined,
      power: powerParam ? getPower(powerParam) : undefined,
      fan: fanParam ? getFan(fanParam) : undefined,
      ssd: ssdParam ? getSsd(ssdParam) : undefined,
      case: caseParam ? getCase(caseParam) : undefined,
    };
    const compatibleItems = <T extends dataProp>(
      partType: BuildPartType,
      items: T[] | undefined,
    ): T[] | undefined => {
      const hasUnresolvedSelection = (
        Object.entries(selectedPartIds) as [BuildPartType, number | undefined][]
      ).some(
        ([selectedPartType, id]) =>
          selectedPartType !== partType &&
          id !== undefined &&
          !selectedBuild[selectedPartType],
      );
      if (hasUnresolvedSelection) return [];

      return items?.filter((item) => {
        const candidate =
          partType === "ram"
            ? { ...item, quantity: ramQuantities[item.id] ?? 1 }
            : item;
        return isPartialBuildCompatible({
          ...selectedBuild,
          [partType]: candidate,
        });
      });
    };

    if (type) {
      switch (type) {
        case "ssd":
          if (ssdList.isSuccessSsdList) {
            setDataList(compatibleItems("ssd", ssdList.data));
          }
          setModalTitle("انتخاب ssd");
          break;
        case "cpu":
          if (cpuList.isSuccessCpuList) {
            setDataList(compatibleItems("cpu", cpuList.data));
          }
          setModalTitle("انتخاب cpu");
          break;
        case "ram":
          if (ramList.isSuccessRamList) {
            setDataList(compatibleItems("ram", ramList.data));
          }
          setModalTitle("انتخاب رم");
          break;
        case "case":
          if (caseList.isSuccessCaseList) {
            setDataList(compatibleItems("case", caseList.data));
          }
          setModalTitle("انتخاب کیس");
          break;
        case "power":
          if (powerList.isSuccessPowerList) {
            setDataList(compatibleItems("power", powerList.data));
          }
          setModalTitle("انتخاب پاور");
          break;
        case "graphic":
          if (graphicList.isSuccessGraphicList) {
            setDataList(compatibleItems("graphic", graphicList.data));
          }
          setModalTitle("انتخاب کارت گرافیک");
          break;
        case "fan":
          if (fanList.isSuccessFanList) {
            setDataList(compatibleItems("fan", fanList.data));
          }
          setModalTitle("انتخاب فن");
          break;
        case "motherboard":
          if (motherboardList.isSuccessMotherboardList) {
            setDataList(compatibleItems("motherboard", motherboardList.data));
          }
          setModalTitle("انتخاب مادربرد");
          break;
        default:
          break;
      }
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
    fanParam,
    ssdParam,
    caseParam,
    ramQuantity,
    selectedRam,
    ramQuantities,
  ]);

  const router = useRouter();

  const handleCardClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, `${id}`);
    if (type === "ram") {
      params.set("ramQuantity", String(ramQuantities[id] ?? 1));
    }
    router.push(`/choose-part?${params.toString()}`);
    close();
  };

  return (
    <Modal size={"1000px"} opened={opened} onClose={close} title={modalTitle}>
      {type === "power" && (
        <Card withBorder radius="md" mt="md" padding="md">
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Group align="flex-start" wrap="nowrap">
              <ThemeIcon color="green" variant="light" radius="xl" size="lg">
                <IconBolt size={20} />
              </ThemeIcon>
              <Stack gap={3}>
                <Text fw={700}>محاسبه توان پاور</Text>
                {psuCalculation ? (
                  <>
                    <Text size="sm" c="dimmed">
                      مصرف تخمینی {psuCalculation.estimatedLoadW} وات + حاشیه
                      امن {psuCalculation.safetyHeadroomW} وات
                    </Text>
                    <Text size="xs" c="dimmed">
                      CPU: {psuCalculation.cpuPowerW}W | GPU:{" "}
                      {psuCalculation.graphicPowerW}W | خنک‌کننده:{" "}
                      {psuCalculation.coolingPowerW}W | سایر قطعات:{" "}
                      {psuCalculation.platformPowerW}W
                    </Text>
                  </>
                ) : (
                  <Text size="sm" c="dimmed">
                    برای محاسبه توان، ابتدا پردازنده یا کارت گرافیک را انتخاب
                    کنید.
                  </Text>
                )}
              </Stack>
            </Group>
            {psuCalculation && (
              <Badge color="green" size="lg" variant="filled">
                پیشنهاد: {psuCalculation.recommendedPsuW} وات
              </Badge>
            )}
          </Group>
          {psuCalculation && (!selectedCpu || !selectedGraphic) && (
            <Text mt="sm" size="xs" c="orange">
              برای پیشنهاد نهایی، پردازنده و کارت گرافیک را هر دو انتخاب کنید.
            </Text>
          )}
        </Card>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="md">
        <Select
          clearable
          data={
            dataList?.map((item) => ({
              value: String(item.id),
              label: item.name,
            })) ?? []
          }
          leftSection={<IconSearch size={17} />}
          nothingFoundMessage="قطعه‌ای پیدا نشد"
          onChange={setSelectedProductId}
          placeholder="جست‌وجو یا انتخاب قطعه"
          searchable
          value={selectedProductId}
        />
        <Select
          allowDeselect={false}
          data={[
            { value: "price-asc", label: "قیمت: کم به زیاد" },
            { value: "price-desc", label: "قیمت: زیاد به کم" },
          ]}
          leftSection={<IconArrowsSort size={17} />}
          onChange={(value) => setSort((value as PartSort) ?? "price-asc")}
          value={sort}
        />
      </SimpleGrid>
      <SimpleGrid
        spacing="lg"
        verticalSpacing="lg"
        py={"lg"}
        cols={{ base: 2, lg: 4 }}
      >
        {visibleData && visibleData.length > 0 ? (
          visibleData.map((item) => {
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
                <ProductConditionBadge
                  condition={item.condition}
                  className={classes.conditionBadge}
                />
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
                <CardPartPrice
                  price={
                    type === "ram" && item.price
                      ? String(
                          Number(item.price) * (ramQuantities[item.id] ?? 1),
                        )
                      : item.price
                  }
                />
                {type === "ram" && (
                  <Group
                    gap={4}
                    justify="center"
                    mt="sm"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {RAM_QUANTITIES.map((quantity) => {
                      const active = quantity === (ramQuantities[item.id] ?? 1);
                      return (
                        <Button
                          key={quantity}
                          color={active ? "teal" : "gray"}
                          fz={12}
                          h={28}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRamQuantities((prev) => ({
                              ...prev,
                              [item.id]: quantity,
                            }));
                          }}
                          px={8}
                          size="compact-xs"
                          variant={active ? "filled" : "subtle"}
                        >
                          {quantity}x
                        </Button>
                      );
                    })}
                  </Group>
                )}
              </Card>
            );
          })
        ) : dataList && dataList.length > 0 ? (
          <Text c="dimmed">قطعه‌ای با این نام پیدا نشد.</Text>
        ) : (
          ""
        )}
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
