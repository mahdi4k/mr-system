"use client";

import KiwiImage from "@/_components/shared/KiwiImage";
import {
  Anchor,
  Breadcrumbs,
  Container,
  Text,
  Group,
  Flex,
  Grid,
  Box,
  Card,
  ThemeIcon,
  Button,
  Divider,
  Badge,
  rem,
} from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import { Product } from "@/_redux/services/adsApi";
import classes from "./adsSingle.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  IconBrandTelegram,
  IconDiscountCheckFilled,
  IconMessages,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import {
  cityTitleHandler,
  formatJalaliTimeAgo,
  provinceTitleHandler,
} from "@/_utils/utils";
import { fetchCity, fetchOstan } from "@/_redux/features/ads";
import { AppDispatch, RootState } from "@/_redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetAdsListCategoryQuery } from "@/_redux/services/adsApi";
import { Carousel, Embla } from "@mantine/carousel";
// Required: without these styles the carousel container is not a flex row
// and slides stack vertically instead of sliding.
import "@mantine/carousel/styles.css";
import AdsRelated from "@/_components/adsSection/AdsRelated";
import AdsGalleryModal from "@/_components/adsSection/AdsGalleryModal";
import { useChat } from "@/_utils/customHook/useChat";
import { getAdStatusDisplay } from "../../../_features/ads/status";

type props = {
  product: Product;
  currentUserId?: string;
};

const PageClient: FC<props> = ({ product, currentUserId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { ostan, city, status } = useSelector((state: RootState) => state.ads);
  const [
    adsQuery,
    {
      data: adsData,
      isSuccess: isSuccessAds,
      isLoading,
      isFetching: isFetchingAds,
    },
  ] = useLazyGetAdsListCategoryQuery();
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [openedImageModal, setOpenedImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (embla) {
      embla?.reInit({ direction: "rtl" });
    }
  }, [embla]);

  useEffect(() => {
    if (!ostan.length) {
      dispatch(fetchOstan());
    }
    if (!city.length) {
      dispatch(fetchCity());
    }
  }, [ostan, city, dispatch]);

  useEffect(() => {
    if (product) adsQuery({ category: product.category.value });
  }, [product]);

  const filteredAds = adsData?.data.filter((ad) => ad.id !== product.id);

  const openModal = (index: number) => {
    setSelectedImage(index);
    setOpenedImageModal(true);
  };

  const galleryImages: string[] = (() => {
    if (!product.image) return [];
    try {
      const parsed: unknown = JSON.parse(product.image);
      return Array.isArray(parsed)
        ? parsed.filter((img): img is string => typeof img === "string")
        : [];
    } catch {
      return [];
    }
  })();

  const { createConversation, creatingConversation } = useChat();
  const isOwnAd = currentUserId === product.user_id;
  const statusDisplay = getAdStatusDisplay(product.status);

  const isFromTelegram = !!product.source?.startsWith("telegram");
  const telegramChannel = product.telegram_channel || null;
  const telegramUsername =
    product.telegram_username ||
    (() => {
      const m = product.description.match(/@([A-Za-z0-9_]{5,32})/);
      return m ? m[1] : null;
    })();
  const telegramLink = telegramUsername
    ? `https://t.me/${telegramUsername}`
    : null;

  const handleStartChat = () => {
    if (currentUserId) {
      createConversation(`${product.id}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <Container
      styles={{ root: { flex: "1 0 auto", width: "100%" } }}
      size={"lg"}
    >
      <Breadcrumbs mb={"lg"} mt={"lg"}>
        <Anchor c={"var(--mantine-color-rigora-2)"} size="sm" href={"/"}>
          خانه
        </Anchor>
        <Anchor
          c={"var(--mantine-color-rigora-2)"}
          size="sm"
          href={`/ads?category=${product.category.value}`}
        >
          {product.category.name}
        </Anchor>
        <Text c="dimmed" size="xs">
          {product.title}
        </Text>
      </Breadcrumbs>

      {galleryImages.length > 0 && (
        <Carousel
          slideSize={{
            base: galleryImages.length === 1 ? "100%" : "62%",
            sm: "40%",
            lg: "21%",
          }}
          slideGap={{ base: "sm", sm: "md" }}
          getEmblaApi={setEmbla}
          align="start"
          dragFree
          withControls={false}
        >
          {galleryImages.map((img, index) => (
            <Carousel.Slide key={`${img}-${index}`} mt={"sm"}>
              <Box
                className={classes.adsImages}
                onClick={() => openModal(index)}
              >
                <KiwiImage
                  objectFit="cover"
                  url={img}
                  width={300}
                  height={300}
                  img={img}
                  alt={product.title}
                />
              </Box>
            </Carousel.Slide>
          ))}
        </Carousel>
      )}

      <Grid gutter={"xl"} mt={{ base: "lg", md: "60px" }} mb={"xl"}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Group mt={"calc(var(--mantine-spacing-lg) * 2)"} align="center">
            <Text fw={"bold"} fz={"h1"}>
              {product.title}
            </Text>
            <Badge
              rightSection={
                product.status === "published" ? (
                  <IconDiscountCheckFilled
                    style={{ width: rem(17), height: rem(17) }}
                  />
                ) : (
                  ""
                )
              }
              color={statusDisplay.color}
            >
              {statusDisplay.label}
            </Badge>
          </Group>
          <Flex
            justify={"space-between"}
            align={"baseline"}
            mt={"calc(var(--mantine-spacing-lg) * 2)"}
          >
            {product.price ? (
              <>
                <Group gap={3} justify="end" align="center" mb="xs">
                  <Text fz={"2rem"} fw={"bold"}>
                    {Intl.NumberFormat("fa", {}).format(Number(product.price))}
                  </Text>
                  <Image
                    className={classes.tomanIcon}
                    src={"/svg/toman.svg"}
                    alt="kiwi part price"
                    width={26}
                    height={26}
                  />
                </Group>
              </>
            ) : (
              ""
            )}
            <Flex align={"baseline"}>
              <Text ml={"2px"} fz={"sm"}>
                {formatJalaliTimeAgo(product.created_at)}
              </Text>
              <Text mr={"2px"}>,</Text>
              <Text mr={"3px"} ta={"left"} fz={"13.5px"}>
                {provinceTitleHandler(status, product.ostan, ostan)}
              </Text>
              <Text mr={"2px"}>,</Text>
              <Text mr={"3px"} ta={"left"} fz={"13.5px"}>
                {cityTitleHandler(status, product.city, city)}
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <Text fz={"xl"} mt={"xl"}>
            توضیحات :{" "}
          </Text>
          <div
            style={{
              whiteSpace: "pre-wrap",
              marginTop: "10px",
              paddingLeft: "30px",
            }}
          >
            {product.description}
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card mt={"xl"} shadow=" rgba(0, 0, 0, 0.1) -4px 9px 25px -6px ">
            <Text fz={"sm"}>اطلاعات تماس</Text>

            {isFromTelegram ? (
              <Flex direction={"column"} align={"center"} justify={"center"}>
                <ThemeIcon
                  mt={"lg"}
                  color="blue"
                  variant="light"
                  radius="xl"
                  size="4rem"
                >
                  <IconBrandTelegram style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Badge
                  mt="md"
                  color="blue"
                  variant="light"
                  leftSection={<IconBrandTelegram size={14} />}
                >
                  آگهی از کانال تلگرام
                </Badge>
                {telegramChannel && (
                  <Text mt={"xs"} fz={"sm"} fw={600} ta="center">
                    {telegramChannel}
                  </Text>
                )}
                {telegramUsername && (
                  <Text fz="xs" c="dimmed" dir="ltr">
                    @{telegramUsername}
                  </Text>
                )}
                <Text fz="xs" c="dimmed" mt="xs" ta="center">
                  این آگهی از تلگرام به ریگورا ارسال شده — برای ارتباط مستقیم به
                  تلگرام مراجعه کنید
                </Text>
                {telegramLink ? (
                  <Button
                    mt={"lg"}
                    size="md"
                    color="blue"
                    radius={"lg"}
                    w={"100%"}
                    leftSection={<IconBrandTelegram size={20} />}
                    component="a"
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    پیام در تلگرام @{telegramUsername}
                  </Button>
                ) : (
                  <Button
                    mt={"lg"}
                    size="md"
                    color="gray"
                    radius={"lg"}
                    variant="light"
                    w={"100%"}
                    disabled
                  >
                    شناسه تلگرام ثبت نشده
                  </Button>
                )}
              </Flex>
            ) : (
              <Flex direction={"column"} align={"center"} justify={"center"}>
                <ThemeIcon
                  mt={"lg"}
                  color="gray"
                  variant="light"
                  radius="xl"
                  size="4rem"
                >
                  <IconUser style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Text mt={"md"} fz={"sm"}>
                  {product.user.name}
                </Text>
                <Button
                  mt={"lg"}
                  size="md"
                  color="green"
                  radius={"lg"}
                  variant="light"
                  w={"100%"}
                  leftSection={<IconPhone size={20} />}
                >
                  {product.user.phone || "شماره تماس ثبت نشده"}
                </Button>
                <Button
                  disabled={isOwnAd}
                  loading={creatingConversation}
                  radius={"lg"}
                  variant="outline"
                  leftSection={<IconMessages />}
                  onClick={handleStartChat}
                  mt="md"
                  w="100%"
                >
                  <Text>
                    {isOwnAd
                      ? "این آگهی متعلق به شماست"
                      : `چت با ${product.user.name}`}
                  </Text>
                </Button>
              </Flex>
            )}
          </Card>
        </Grid.Col>
      </Grid>
      <Divider />
      {isSuccessAds && filteredAds && filteredAds.length > 0 && (
        <AdsRelated filteredAds={filteredAds} isFetchingAds={isFetchingAds} />
      )}
      <AdsGalleryModal
        image={product.image}
        openedImageModal={openedImageModal}
        selectedImage={selectedImage}
        setOpenedImageModal={setOpenedImageModal}
      />
    </Container>
  );
};

export default PageClient;
