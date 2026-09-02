"use client";

import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Skeleton,
  Tabs,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import usePcparts from "@/_utils/customHook/usePcParts";
import { Carousel, Embla } from "@mantine/carousel";
import CardPartPrice from "../shared/CardPartPrice";
import { IconFlag3, IconPlus } from "@tabler/icons-react";
import { useLazyGetAdsListCategoryQuery } from "@/_redux/services/adsApi";
import {
  cityTitleHandler,
  formatJalaliTimeAgo,
  provinceTitleHandler,
} from "@/_utils/utils";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/_redux/store";
import { fetchCity, fetchOstan } from "@/_redux/features/ads";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import ImgNoProduct from "../../../public/no-product.png";
import classess from "./ads.module.css";
import "@mantine/carousel/styles.css";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const AdsSection = () => {
  const [embla, setEmbla] = useState<Embla | null>(null);
  // Mobile: the "create ad" card is replaced by a full-width button below the carousel
  const isMobile = useMediaQuery("(max-width: 36em)", false, {
    getInitialValueInEffect: true,
  });
  const parts = usePcparts();
  const [activeTab, setActiveTab] = useState<string | null>("cpu");

  const [
    adsQuery,
    {
      data: adsData,
      isSuccess: isSuccessAds,
      isLoading,
      isFetching: isFetchingAds,
      isError: isErrorAds,
    },
  ] = useLazyGetAdsListCategoryQuery();

  const isLoadingAds = isLoading || isFetchingAds;
  const hasAds = Boolean(
    isSuccessAds && adsData?.data && adsData.data.length > 0,
  );
  const isEmptyAds = Boolean(
    isSuccessAds && !isLoadingAds && adsData && adsData.data.length === 0,
  );

  const dispatch: AppDispatch = useDispatch();
  const { ostan, city, status } = useSelector((state: RootState) => state.ads);

  useEffect(() => {
    return undefined;
  }, []);

  useEffect(() => {
    if (!ostan.length) {
      dispatch(fetchOstan());
    }
    if (!city.length) {
      dispatch(fetchCity());
    }
  }, [ostan, city, dispatch]);

  useEffect(() => {
    if (embla) {
      embla?.reInit({ direction: "rtl" });
    }
  }, [embla, isMobile]);

  // const handleAddAdsPage = () => {
  //     if (token || success) {
  //         router.push('/ads/create', { scroll: true })
  //     } else {
  //         sessionStorage.setItem('redirectPath', '/ads/create'); // Save redirect path
  //         open()
  //     }
  // }
  useEffect(() => {
    if (activeTab) adsQuery({ category: activeTab });
  }, [activeTab]);

  const handleImageAds = (image: string | undefined, title: string) => {
    if (!image) {
      return (
        <Image
          fill
          style={{ objectFit: "contain", padding: "14px" }}
          sizes="220px"
          alt="no img"
          src={ImgNoProduct}
        />
      );
    }

    let images: string[];
    try {
      images = JSON.parse(image);
    } catch {
      images = [];
    }

    if (images.length > 0) {
      return (
        <Image
          alt={title}
          fill
          style={{ objectFit: "contain", padding: "10px" }}
          sizes="220px"
          src={`${images[0]}`}
        />
      );
    } else {
      return (
        <Image
          fill
          style={{ objectFit: "contain", padding: "14px" }}
          sizes="220px"
          alt="no img"
          src={ImgNoProduct}
        />
      );
    }
  };
  return (
    <Container mt={"100px"} my={"xl"} size="lg">
      <Flex justify={"space-between"}>
        <Text>آگهی قطعات</Text>
        <Link href={"/ads"}>
          <Button color="green" variant="outline">
            مشاهده همه
          </Button>
        </Link>
      </Flex>
      <Tabs
        mt={"lg"}
        variant="outline"
        color="teal"
        styles={{
          // The default outline line is an ::before inside the scrollable list,
          // so it only spans the visible width when the tabs overflow.
          // Draw the border on each tab instead so it covers the full scroll width.
          list: {
            flexWrap: "nowrap",
            overflow: "auto",
            "&::before": { display: "none" },
          },
          tab: {
            "--tab-border-bottom-color": "var(--tab-border-color)",
          },
        }}
        defaultValue={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List>
          {parts.map((part) => (
            <Tabs.Tab
              key={part.name}
              value={part.name}
              leftSection={
                <Image width={20} height={20} src={part.svg} alt={part.title} />
              }
            >
              {part.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel style={{ direction: "rtl" }} value={activeTab as string}>
          <Carousel
            slideSize={{ base: "45%", xs: "26%", xl: "20%" }}
            slideGap={{ base: "sm", sm: "md" }}
            getEmblaApi={setEmbla}
            align="start"
            dragFree
            withControls={false}
          >
            {!isMobile && (
              <Carousel.Slide mt={"sm"}>
                <Link className={classess.createAdLink} href={"/ads/create"}>
                  <Card className={classess.createAdCard} h="276px" withBorder>
                    <Card.Section className={classess.createAdSection}>
                      <Box className={classess.createAdIcon}>
                        <IconPlus aria-hidden size={34} stroke={2.4} />
                      </Box>
                      <Box className={classess.createAdAction}>
                        <Text component="span" fz="sm" fw={700}>
                          افزودن
                        </Text>
                      </Box>
                    </Card.Section>
                  </Card>
                </Link>
              </Carousel.Slide>
            )}
            {hasAds &&
              adsData!.data.map((item) => (
                <Carousel.Slide key={item.id} mt={"sm"}>
                  <Link href={`/ads/${item.id}`} className={classess.adLink}>
                    <Card
                      withBorder
                      shadow="sm"
                      padding="sm"
                      className={classess.adCard}
                    >
                      <Card.Section mt={"0"} className={classess.adImageBox}>
                        {handleImageAds(item.image, item.title)}
                      </Card.Section>
                      <Text
                        ta={"right"}
                        mt={"xs"}
                        lineClamp={1}
                        fz={"sm"}
                        fw={600}
                        className={classess.adTitle}
                      >
                        {item.title}
                      </Text>
                      <Flex
                        align={"baseline"}
                        justify={"space-between"}
                        gap={"xs"}
                      >
                        {item.price ? (
                          <CardPartPrice isAds price={item.price} />
                        ) : (
                          <Text fz={"sm"} c={"#25ac9e"}>
                            توافقی
                          </Text>
                        )}
                        <Text
                          fz={"11px"}
                          c="dimmed"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {formatJalaliTimeAgo(item.created_at)}
                        </Text>
                      </Flex>
                      <Flex
                        justify={"flex-end"}
                        mt={6}
                        align={"center"}
                        gap={4}
                        wrap="nowrap"
                      >
                        <IconFlag3 size={13} style={{ flexShrink: 0 }} />
                        <Text fz={"11px"} c="dimmed" lineClamp={1}>
                          {provinceTitleHandler(status, item.ostan, ostan)}،{" "}
                          {cityTitleHandler(status, item.city, city)}
                        </Text>
                      </Flex>
                    </Card>
                  </Link>
                </Carousel.Slide>
              ))}
            {isLoadingAds && !hasAds && !isEmptyAds && !isErrorAds && (
              <Group wrap="nowrap" mt={"md"} gap={"lg"}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Box className={classess.adsSkeleton} key={index}>
                    <Skeleton height="100%" radius="md" />
                  </Box>
                ))}
              </Group>
            )}
            {isEmptyAds && (
              <Carousel.Slide mt={"sm"}>
                <Card h="276px" withBorder className={classess.emptyAdCard}>
                  <Card.Section className={classess.emptyAdSection} h="100%">
                    <Text c="dimmed" fz="sm" fw={600} ta="center">
                      هنوز آگهی‌ای در این دسته ثبت نشده
                    </Text>
                    <Text c="dimmed" fz="xs" ta="center">
                      اولین آگهی را شما ثبت کنید
                    </Text>
                  </Card.Section>
                </Card>
              </Carousel.Slide>
            )}
            {isErrorAds && !isLoadingAds && (
              <Carousel.Slide mt={"sm"}>
                <Card h="276px" withBorder>
                  <Card.Section
                    h="100%"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text c="dimmed" fz="sm" ta="center">
                      خطا در دریافت آگهی‌ها
                    </Text>
                  </Card.Section>
                </Card>
              </Carousel.Slide>
            )}
          </Carousel>
          <Box display={{ base: "block", xs: "none" }} mt="md">
            <Link href={"/ads/create"} style={{ textDecoration: "none" }}>
              <Button
                fullWidth
                h={"48px"}
                color="#9bb814"
                radius="xl"
                leftSection={<IconPlus size={20} stroke={2.4} />}
              >
                افزودن آگهی
              </Button>
            </Link>
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default AdsSection;
