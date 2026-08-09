"use client";

import ChoosePartItem from "@/_components/chooseParts/ChoosePartItem";
import {
  Box,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import React, { Suspense, useEffect, useState } from "react";
import classes from "./style.module.css";
import {
  useLazyGetCaseQuery,
  useLazyGetCasesQuery,
} from "@/_redux/services/caseApi";
import ModalPart from "@/_components/chooseParts/ModalPart";
import CardPartPrice from "@/_components/shared/CardPartPrice";
import CopyPartList from "@/_components/chooseParts/CopyPartList";
import {
  useLazyGetCpusQuery,
  useLazyGetFansQuery,
  useLazyGetRamsQuery,
  useLazyGetGraphicsQuery,
  useLazyGetSsdsQuery,
  useLazyGetMotherboardsQuery,
  useLazyGetPowersQuery,
  useLazyGetCpuQuery,
  useLazyGetGraphicQuery,
  useLazyGetMotherboardQuery,
  useLazyGetFanQuery,
  useLazyGetSsdQuery,
  useLazyGetRamQuery,
  useLazyGetPowerQuery,
} from "@/_redux/services";
import SearchParamsHandler from "@/_components/chooseParts/SearchParamHandler";
import TotalPriceCalculator from "@/_components/chooseParts/TotalPriceCalculator";
import BuildAssistant from "@/_components/chooseParts/BuildAssistant";
import { IconRotate } from "@tabler/icons-react";

interface PageClientProps {
  showAssistant?: boolean;
}

const PageClient: React.FC<PageClientProps> = ({ showAssistant = false }) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedType, setSelectedType] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const [isPartEmpty, setIsPartEmpty] = useState({
    cpu: false,
    motherboard: false,
    graphic: false,
    fan: false,
    ram: false,
    ssd: false,
    power: false,
    case: false,
  });

  const [caseListQuery, { data: caseList, isSuccess: isSuccessCaseList }] =
    useLazyGetCasesQuery();
  const [cpuListQuery, { data: cpuList, isSuccess: isSuccessCpuList }] =
    useLazyGetCpusQuery();
  const [fanListQuery, { data: fanList, isSuccess: isSuccessFanList }] =
    useLazyGetFansQuery();
  const [ramListQuery, { data: ramList, isSuccess: isSuccessRamList }] =
    useLazyGetRamsQuery();
  const [
    graphicListQuery,
    { data: graphicList, isSuccess: isSuccessGraphicList },
  ] = useLazyGetGraphicsQuery();
  const [ssdListQuery, { data: ssdList, isSuccess: isSuccessSsdList }] =
    useLazyGetSsdsQuery();
  const [
    motherboardListQuery,
    { data: motherboardList, isSuccess: isSuccessMotherboardList },
  ] = useLazyGetMotherboardsQuery();
  const [powerListQuery, { data: powerList, isSuccess: isSuccessPowerList }] =
    useLazyGetPowersQuery();

  const handleModalOpen = (dataQuery: any, type: string) => {
    dataQuery({}, true);
    setSelectedType(type);
    open();
  };

  const [
    cpuItem,
    { data: cpuData, isSuccess: isSuccessCpu, isFetching: isFetchingCpu },
  ] = useLazyGetCpuQuery();
  const [
    graphicItem,
    {
      data: graphicData,
      isSuccess: isSuccessGraphic,
      isFetching: isFetchingGraphic,
    },
  ] = useLazyGetGraphicQuery();
  const [
    motherboardItem,
    {
      data: motherboardData,
      isSuccess: isSuccessMotherboardData,
      isFetching: isFetchingMotherboard,
    },
  ] = useLazyGetMotherboardQuery();
  const [
    fanItem,
    { data: fanData, isSuccess: isSuccessFan, isFetching: isFetchingFan },
  ] = useLazyGetFanQuery();
  const [
    ssdItem,
    { data: ssdData, isSuccess: isSuccessSsd, isFetching: isFetchingSsd },
  ] = useLazyGetSsdQuery();
  const [
    ramItem,
    { data: ramData, isSuccess: isSuccessRam, isFetching: isFetchingRam },
  ] = useLazyGetRamQuery();
  const [
    caseItem,
    { data: caseData, isSuccess: isSuccessCase, isFetching: isFetchingCase },
  ] = useLazyGetCaseQuery();
  const [
    powerItem,
    { data: powerData, isSuccess: isSuccessPower, isFetching: isFetchingPower },
  ] = useLazyGetPowerQuery();

  return (
    <div className={classes.container}>
      <Suspense>
        <SearchParamsHandler
          setIsPartEmpty={setIsPartEmpty}
          cpuItem={cpuItem}
          graphicItem={graphicItem}
          fanItem={fanItem}
          ramItem={ramItem}
          ssdItem={ssdItem}
          caseItem={caseItem}
          powerItem={powerItem}
          motherboardItem={motherboardItem}
        />
        <TotalPriceCalculator
          cpuData={cpuData}
          graphicData={graphicData}
          motherboardData={motherboardData}
          fanData={fanData}
          ssdData={ssdData}
          ramData={ramData}
          caseData={caseData}
          powerData={powerData}
          setTotalPrice={setTotalPrice}
        />

        <Container
          mb={"100px"}
          mt={"60px"}
          styles={{ root: { flex: "1 0 auto" } }}
          size={"lg"}
        >
          <Flex
            align="center"
            justify="center"
            mb={"24px"}
            pos="relative"
            px={"sm"}
          >
            <Text fw={"bold"} fz={"xl"} ta={"center"}>
              هوشمندانه انتخاب کنید{" "}
            </Text>
            {Object.values(isPartEmpty).every((isEmpty) => !isEmpty) && (
              <Button
                color="red"
                leftSection={<IconRotate size={18} />}
                onClick={() => router.push("/choose-part")}
                pos="absolute"
                size="xs"
                styles={{ root: { insetInlineStart: 0 } }}
                variant="light"
              >
                حذف همه
              </Button>
            )}
          </Flex>
          <SimpleGrid
            spacing={{ base: "sm", lg: "xl" }}
            verticalSpacing={{ base: "sm", lg: "xl" }}
            style={{ justifyItems: "center" }}
            cols={{ base: 2, sm: 4 }}
          >
            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() => handleModalOpen(cpuListQuery, "cpu")}
            >
              <LoadingOverlay
                visible={selectedType === "cpu" && isFetchingCpu}
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={cpuData?.data}
                partEmpty={isPartEmpty.cpu}
                svg={"/svg/cpu.svg"}
                title="cpu"
                type="cpu"
              />
            </Box>

            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() =>
                handleModalOpen(motherboardListQuery, "motherboard")
              }
            >
              <LoadingOverlay
                visible={
                  selectedType === "motherboard" && isFetchingMotherboard
                }
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={motherboardData?.data}
                partEmpty={isPartEmpty.motherboard}
                svg={"/svg/motherboard.svg"}
                type="motherboard"
                title="motherboard"
              />
            </Box>

            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() => handleModalOpen(graphicListQuery, "graphic")}
            >
              <LoadingOverlay
                visible={selectedType === "graphic" && isFetchingGraphic}
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={graphicData?.data}
                partEmpty={isPartEmpty.graphic}
                svg={"/svg/graphic.svg"}
                type="graphic"
                title="graphic"
              />
            </Box>

            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() => handleModalOpen(powerListQuery, "power")}
            >
              <LoadingOverlay
                visible={selectedType === "power" && isFetchingPower}
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={powerData?.data}
                partEmpty={isPartEmpty.power}
                svg={"/svg/power.svg"}
                type="power"
                title="power"
              />
            </Box>

            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() => handleModalOpen(ramListQuery, "ram")}
            >
              <LoadingOverlay
                visible={selectedType === "ram" && isFetchingRam}
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={ramData?.data}
                partEmpty={isPartEmpty.ram}
                svg={"/svg/ram.svg"}
                type="ram"
                title="رم"
              />
            </Box>

            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() => handleModalOpen(fanListQuery, "fan")}
            >
              <LoadingOverlay
                visible={selectedType === "fan" && isFetchingFan}
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={fanData?.data}
                partEmpty={isPartEmpty.fan}
                svg={"/svg/fan.svg"}
                type="fan"
                title="فن"
              />
            </Box>

            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() => handleModalOpen(ssdListQuery, "ssd")}
            >
              <LoadingOverlay
                visible={selectedType === "ssd" && isFetchingSsd}
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={ssdData?.data}
                partEmpty={isPartEmpty.ssd}
                svg={"/svg/ssd.svg"}
                type="ssd"
                title="ssd"
              />
            </Box>

            <Box
              pos="relative"
              className="cursor-pointer"
              onClick={() => handleModalOpen(caseListQuery, "case")}
            >
              <LoadingOverlay
                visible={selectedType === "case" && isFetchingCase}
                zIndex={1000}
                loaderProps={{ color: "green", type: "bars" }}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <ChoosePartItem
                itemData={caseData?.data}
                partEmpty={isPartEmpty.case}
                svg={"/svg/case.svg"}
                type="case"
                title="کیس"
              />
            </Box>
          </SimpleGrid>

          <Flex ml={"md"} align={"center"} justify={"flex-end"} mt={"xl"}>
            {Number(totalPrice) > 0 ? (
              <>
                <Text ml={"xs"} mt={"2px"} size="sm">
                  قیمت کل :‌
                </Text>
                <CardPartPrice price={totalPrice} />
              </>
            ) : (
              ""
            )}
          </Flex>

          <CopyPartList
            isSuccessMotherboardData={isSuccessMotherboardData}
            isSuccessCpu={isSuccessCpu}
            isSuccessGraphic={isSuccessGraphic}
            isSuccessPower={isSuccessPower}
            isSuccessRam={isSuccessRam}
            isSuccessFan={isSuccessFan}
            isSuccessSsd={isSuccessSsd}
            isSuccessCase={isSuccessCase}
            motherboardData={motherboardData}
            cpuData={cpuData}
            graphicData={graphicData}
            powerData={powerData}
            ramData={ramData}
            fanData={fanData}
            ssdData={ssdData}
            caseData={caseData}
            totalPrice={totalPrice}
          />
          {showAssistant && <BuildAssistant />}
        </Container>

        <ModalPart
          type={selectedType}
          cpuList={{
            data: cpuList,
            isSuccessCpuList,
            motherboardData: motherboardData?.data.cpus,
            ramData: ramData?.data.cpus,
          }}
          ramList={{
            data: ramList,
            isSuccessRamList,
            motherboardData: motherboardData?.data.rams,
            cpuData: cpuData?.data.rams,
          }}
          caseList={{ data: caseList, isSuccessCaseList }}
          powerList={{
            data: powerList,
            isSuccessPowerList,
            graphicData: graphicData?.data.powers,
          }}
          graphicList={{
            data: graphicList,
            isSuccessGraphicList,
            cpuData: cpuData?.data.graphics,
            powerData: powerData?.data.graphics,
          }}
          fanList={{
            data: fanList,
            isSuccessFanList,
            cpuData: cpuData?.data.fans,
          }}
          ssdList={{ data: ssdList, isSuccessSsdList }}
          motherboardList={{
            data: motherboardList,
            isSuccessMotherboardList,
            cpuData: cpuData?.data.motherboards,
            ramData: ramData?.data.motherboards,
          }}
          close={close}
          opened={opened}
        />
      </Suspense>
    </div>
  );
};

export default PageClient;
