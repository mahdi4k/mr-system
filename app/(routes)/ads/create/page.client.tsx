"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "./ActionGrid.module.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { UseAdsCategory } from "@/_components/adsSection/UseAdsCategorySelect";
import ModalSubmit from "@/_components/adsSection/ModalSubmit";
import { useDisclosure } from "@mantine/hooks";
import { City, Province } from "./page";
import {
  convertNumberToWords,
  formatNumber,
  persianToWesternNumerals,
} from "@/_utils/utils";
import AdsImageForm from "@/_components/adsSection/AdsImageForm";
import { notifications } from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import { createAd } from "../../../_features/ads/data";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../_redux/store";
import { api } from "../../../_redux/services/api";
import type { AdCreationProgress } from "../../../_features/ads/types";
import { requestTelegramAdNotification } from "../../../_features/ads/telegram";
import {
  IconCheck,
  IconChevronLeft,
  IconFileDescription,
  IconMapPin,
  IconPhoto,
  IconShieldCheck,
  IconTag,
} from "@tabler/icons-react";
import Link from "next/link";

interface PageClientProps {
  categories: Array<{ icon: string; id: number; name: string }>;
}

export default function PageClient({ categories }: PageClientProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [showErrorOstan, setShowErrorOstan] = useState(false);
  const [showErrorCategory, setShowErrorCategory] = useState(false);
  const [priceInWords, setPriceInWords] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [creationProgress, setCreationProgress] =
    useState<AdCreationProgress | null>(null);
  const { items, activeCategory, activeCategoryName } = UseAdsCategory(
    categories,
    () => setShowErrorCategory(false),
  );
  const dispatch: AppDispatch = useDispatch();

  const form = useForm({
    initialValues: {
      title: "",
      category_id: "",
      city: null,
      ostan: "",
      price: "",
      description: "",
    },
    validate: {
      title: (value: string) =>
        value.trim().length >= 3 && value.trim().length <= 120
          ? null
          : "عنوان باید بین ۳ تا ۱۲۰ نویسه باشد",
      description: (value: string) =>
        value.trim().length >= 10 && value.trim().length <= 5000
          ? null
          : "توضیحات باید بین ۱۰ تا ۵۰۰۰ نویسه باشد",
      city: isNotEmpty("فیلد شهر اجباری است"),
    },
  });

  const handleProvinceChange = (provinceId: string | null) => {
    form.setFieldValue("city", null);

    if (provinceId) {
      setSelectedProvince(parseInt(provinceId, 10));
      const citiesForProvince = cities.filter(
        (city) => city.province_id === parseInt(provinceId, 10),
      );
      setAvailableCities(citiesForProvince);
      form.setFieldValue("ostan", provinceId);
      setShowErrorOstan(false);
    }
  };
  useEffect(() => {
    // Fetch provinces and cities data from public folder
    const fetchProvincesAndCities = async () => {
      const provincesResponse = await fetch("/provinces.json");
      const citiesResponse = await fetch("/cities.json");

      const provincesData: Province[] = await provincesResponse.json();
      const citiesData: City[] = await citiesResponse.json();

      setProvinces(provincesData);
      setCities(citiesData);
    };

    fetchProvincesAndCities();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    if (!activeCategory || !selectedProvince || !values.city) {
      validateOtherField();
      return;
    }
    if (processingImages) {
      notifications.show({
        color: "orange",
        message: "لطفاً تا پایان آماده‌سازی تصاویر صبر کنید.",
      });
      return;
    }

    setLoading(true);
    setCreationProgress({
      stage: "creating",
      completed: 0,
      total: images.length,
    });
    try {
      const rawPrice = values.price.replace(/,/g, "");
      const ad = await createAd(
        {
          title: values.title,
          description: values.description,
          categoryId: activeCategory,
          provinceId: selectedProvince,
          cityId: Number(values.city),
          price: rawPrice ? Number(rawPrice) : null,
          images,
        },
        setCreationProgress,
      );
      await requestTelegramAdNotification(ad.id);
      dispatch(api.util.invalidateTags(["ads"]));
      open();
      setImages([]);
      form.reset();
      setSelectedProvince(null);
      notifications.show({
        color: "green",
        message: "آگهی ثبت شد و پس از بررسی منتشر می‌شود.",
        classNames: notifClasses,
      });
    } catch (error) {
      notifications.show({
        color: "red",
        message:
          error instanceof Error ? error.message : "ثبت آگهی ناموفق بود.",
        classNames: notifClasses,
      });
    } finally {
      setLoading(false);
      setCreationProgress(null);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const westernValue = persianToWesternNumerals(inputValue);
    const numericValue = parseInt(westernValue.replace(/,/g, ""), 10);

    const priceWords = convertNumberToWords(numericValue);
    setPriceInWords(priceWords);

    const formattedValue = formatNumber(westernValue);
    form.setFieldValue("price", formattedValue);
  };

  const validateOtherField = () => {
    selectedProvince === null
      ? setShowErrorOstan(true)
      : setShowErrorOstan(false);
    activeCategory === null
      ? setShowErrorCategory(true)
      : setShowErrorCategory(false);
  };

  const completedSections = [
    form.values.title.trim().length >= 3 && activeCategory !== null,
    images.length > 0,
    selectedProvince !== null && Boolean(form.values.city),
    form.values.description.trim().length >= 10,
  ].filter(Boolean).length;
  const completion = (completedSections / 4) * 100;

  return (
    <Box className={classes.page}>
      <Container size="lg">
        <Group className={classes.breadcrumb} gap={6} mb="md">
          <Text component={Link} href="/ads" c="dimmed" fz="sm">
            آگهی‌ها
          </Text>
          <IconChevronLeft size={14} />
          <Text fz="sm" fw={600}>
            ثبت آگهی جدید
          </Text>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit, validateOtherField)}>
          <div className={classes.layout}>
            <Stack gap="md">
              <Paper className={classes.section} radius="lg" withBorder>
                <Group align="flex-start" gap="sm" mb="lg" wrap="nowrap">
                  <ThemeIcon
                    color="green"
                    radius="md"
                    size="lg"
                    variant="light"
                  >
                    <IconTag size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={800}>مشخصات اصلی</Text>
                    <Text c="dimmed" fz="sm">
                      خریدار باید در یک نگاه بداند چه چیزی می‌فروشید.
                    </Text>
                  </Box>
                  <Text className={classes.stepNumber}>۰۱</Text>
                </Group>

                <Stack gap="lg">
                  <TextInput
                    description="نام دقیق قطعه، برند و مدل را بنویسید."
                    label="عنوان آگهی"
                    maxLength={120}
                    placeholder="مثلاً کارت گرافیک ASUS RTX 3060 Dual"
                    rightSection={
                      <Text c="dimmed" fz="xs">
                        {form.values.title.length}/۱۲۰
                      </Text>
                    }
                    rightSectionWidth={55}
                    size="md"
                    withAsterisk
                    {...form.getInputProps("title")}
                  />

                  <Box>
                    <Group justify="space-between" mb="xs">
                      <Text fz="sm" fw={600}>
                        دسته‌بندی{" "}
                        <Text component="span" c="red">
                          *
                        </Text>
                      </Text>
                      {activeCategoryName && (
                        <Text c="green.7" fz="xs" fw={700}>
                          {activeCategoryName} انتخاب شد
                        </Text>
                      )}
                    </Group>
                    <SimpleGrid cols={{ base: 2, xs: 4 }} spacing="sm">
                      {items}
                    </SimpleGrid>
                    {showErrorCategory && (
                      <Text c="red" fz="xs" mt={6}>
                        انتخاب دسته‌بندی الزامی است.
                      </Text>
                    )}
                  </Box>
                </Stack>
              </Paper>

              <Paper className={classes.section} radius="lg" withBorder>
                <Group align="flex-start" gap="sm" mb="lg" wrap="nowrap">
                  <ThemeIcon
                    color="green"
                    radius="md"
                    size="lg"
                    variant="light"
                  >
                    <IconPhoto size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={800}>تصاویر محصول</Text>
                    <Text c="dimmed" fz="sm">
                      عکس اول به‌عنوان تصویر اصلی آگهی نمایش داده می‌شود.
                    </Text>
                  </Box>
                  <Text className={classes.stepNumber}>۰۲</Text>
                </Group>

                <AdsImageForm
                  images={images}
                  onProcessingChange={setProcessingImages}
                  setImages={setImages}
                />
              </Paper>

              <Paper className={classes.section} radius="lg" withBorder>
                <Group align="flex-start" gap="sm" mb="lg" wrap="nowrap">
                  <ThemeIcon
                    color="green"
                    radius="md"
                    size="lg"
                    variant="light"
                  >
                    <IconMapPin size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={800}>موقعیت و قیمت</Text>
                    <Text c="dimmed" fz="sm">
                      محل کالا را مشخص کنید و قیمت منصفانه بگذارید.
                    </Text>
                  </Box>
                  <Text className={classes.stepNumber}>۰۳</Text>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Box>
                    <Select
                      data={provinces.map((province) => ({
                        value: province.id.toString(),
                        label: province.name,
                      }))}
                      label="استان"
                      onChange={handleProvinceChange}
                      placeholder="انتخاب استان"
                      searchable
                      size="md"
                      value={
                        selectedProvince ? selectedProvince.toString() : null
                      }
                      withAsterisk
                    />
                    {showErrorOstan && (
                      <Text c="red" fz="xs" mt={6}>
                        انتخاب استان الزامی است.
                      </Text>
                    )}
                  </Box>
                  <Select
                    data={availableCities.map((city) => ({
                      value: city.id.toString(),
                      label: city.name,
                    }))}
                    disabled={!selectedProvince}
                    label="شهر"
                    placeholder={
                      selectedProvince
                        ? "انتخاب شهر"
                        : "ابتدا استان را انتخاب کنید"
                    }
                    searchable
                    size="md"
                    withAsterisk
                    {...form.getInputProps("city")}
                  />
                </SimpleGrid>

                <TextInput
                  description={
                    priceInWords
                      ? `${priceInWords} تومان`
                      : "اگر قیمت توافقی است، این بخش را خالی بگذارید."
                  }
                  inputMode="numeric"
                  label="قیمت"
                  leftSection={
                    <Text c="dimmed" fz="xs">
                      تومان
                    </Text>
                  }
                  leftSectionWidth={48}
                  mt="lg"
                  onChange={handlePriceChange}
                  placeholder="مثلاً ۱۲,۵۰۰,۰۰۰"
                  size="md"
                  value={form.values.price}
                />
              </Paper>

              <Paper className={classes.section} radius="lg" withBorder>
                <Group align="flex-start" gap="sm" mb="lg" wrap="nowrap">
                  <ThemeIcon
                    color="green"
                    radius="md"
                    size="lg"
                    variant="light"
                  >
                    <IconFileDescription size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={800}>توضیحات تکمیلی</Text>
                    <Text c="dimmed" fz="sm">
                      وضعیت ظاهری، مدت استفاده، سلامت و اقلام همراه را ذکر کنید.
                    </Text>
                  </Box>
                  <Text className={classes.stepNumber}>۰۴</Text>
                </Group>

                <Textarea
                  autosize
                  label="توضیحات آگهی"
                  maxLength={5000}
                  minRows={7}
                  placeholder="مثلاً قطعه ۸ ماه استفاده شده، بدون تعمیر و دارای جعبه اصلی است..."
                  size="md"
                  withAsterisk
                  {...form.getInputProps("description")}
                />
                <Group justify="space-between" mt={6}>
                  <Text c="dimmed" fz="xs">
                    اطلاعات تماس را در متن آگهی وارد نکنید.
                  </Text>
                  <Text c="dimmed" fz="xs">
                    {form.values.description.length}/۵۰۰۰
                  </Text>
                </Group>
              </Paper>
            </Stack>

            <aside className={classes.sidebar}>
              <Paper className={classes.summary} radius="lg" withBorder>
                <Group justify="space-between">
                  <Text fw={800}>آمادگی انتشار</Text>
                  <Text c="green.7" fz="sm" fw={800}>
                    {completedSections} از ۴
                  </Text>
                </Group>
                <Progress
                  color="green"
                  mt="sm"
                  radius="xl"
                  size="sm"
                  value={completion}
                />

                <Stack gap="sm" mt="lg">
                  {[
                    [
                      "عنوان و دسته‌بندی",
                      completedSections > 0 &&
                        form.values.title.trim().length >= 3 &&
                        activeCategory !== null,
                    ],
                    ["حداقل یک تصویر", images.length > 0],
                    [
                      "موقعیت آگهی",
                      selectedProvince !== null && Boolean(form.values.city),
                    ],
                    [
                      "توضیحات کامل",
                      form.values.description.trim().length >= 10,
                    ],
                  ].map(([label, complete]) => (
                    <Group gap="xs" key={String(label)} wrap="nowrap">
                      <ThemeIcon
                        color={complete ? "green" : "gray"}
                        radius="xl"
                        size={22}
                        variant={complete ? "filled" : "light"}
                      >
                        <IconCheck size={13} />
                      </ThemeIcon>
                      <Text c={complete ? undefined : "dimmed"} fz="sm">
                        {label}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                <Box className={classes.reviewNote} mt="lg">
                  <Group align="flex-start" gap="xs" wrap="nowrap">
                    <IconShieldCheck
                      color="var(--mantine-color-green-7)"
                      size={20}
                    />
                    <Text c="dimmed" fz="xs" lh={1.7}>
                      آگهی پس از بررسی کوتاه تیم ریگورا منتشر می‌شود. اطلاعات
                      دقیق، بررسی را سریع‌تر می‌کند.
                    </Text>
                  </Group>
                </Box>

                {creationProgress && (
                  <Alert color="green" mt="md" variant="light">
                    <Text fz="sm" fw={600} mb="xs">
                      {creationProgress.stage === "creating"
                        ? "در حال ثبت اطلاعات آگهی..."
                        : creationProgress.stage === "uploading"
                          ? `بارگذاری تصاویر (${creationProgress.completed} از ${creationProgress.total})`
                          : "در حال نهایی‌سازی آگهی..."}
                    </Text>
                    <Progress
                      animated
                      value={
                        creationProgress.stage === "creating"
                          ? 10
                          : creationProgress.stage === "saving"
                            ? 95
                            : creationProgress.total
                              ? 15 +
                                (creationProgress.completed /
                                  creationProgress.total) *
                                  75
                              : 85
                      }
                    />
                  </Alert>
                )}

                <Button
                  className={classes.submitButton}
                  disabled={processingImages}
                  fullWidth
                  loading={loading}
                  mt="lg"
                  size="md"
                  type="submit"
                >
                  {processingImages
                    ? "آماده‌سازی تصاویر..."
                    : "ثبت و ارسال برای بررسی"}
                </Button>
                <Text c="dimmed" fz="xs" mt="xs" ta="center">
                  ثبت آگهی رایگان است
                </Text>
              </Paper>
            </aside>
          </div>
        </form>
        <ModalSubmit opened={opened} close={close} />
      </Container>
    </Box>
  );
}
