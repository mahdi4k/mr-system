"use client";

import AdsImageForm from "@/_components/adsSection/AdsImageForm";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateAd } from "../../../../_features/ads/data";
import type { Product } from "../../../../_features/ads/types";
import type { City, Province } from "../../create/page";

interface PageClientProps {
  ad: Product;
  categories: Array<{ id: number; name: string }>;
}

function parseImageUrls(image?: string): string[] {
  try {
    return image ? (JSON.parse(image) as string[]) : [];
  } catch {
    return [];
  }
}

export default function PageClient({ ad, categories }: PageClientProps) {
  const initialImages = parseImageUrls(ad.image);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [retainedImages, setRetainedImages] = useState(initialImages);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [processingImages, setProcessingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      categoryId: ad.category.id.toString(),
      cityId: ad.city,
      description: ad.description,
      price: ad.price,
      provinceId: ad.ostan,
      title: ad.title,
    },
    validate: {
      categoryId: isNotEmpty("انتخاب دسته‌بندی الزامی است"),
      cityId: isNotEmpty("انتخاب شهر الزامی است"),
      description: (value: string) =>
        value.trim().length >= 10 && value.trim().length <= 5000
          ? null
          : "توضیحات باید بین ۱۰ تا ۵۰۰۰ نویسه باشد",
      price: (value: string) =>
        !value || (/^\d+$/.test(value) && Number(value) >= 0)
          ? null
          : "قیمت معتبر نیست",
      provinceId: isNotEmpty("انتخاب استان الزامی است"),
      title: (value: string) =>
        value.trim().length >= 3 && value.trim().length <= 120
          ? null
          : "عنوان باید بین ۳ تا ۱۲۰ نویسه باشد",
    },
  });

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const [provincesResponse, citiesResponse] = await Promise.all([
          fetch("/provinces.json"),
          fetch("/cities.json"),
        ]);
        if (!provincesResponse.ok || !citiesResponse.ok) throw new Error();
        setProvinces((await provincesResponse.json()) as Province[]);
        setCities((await citiesResponse.json()) as City[]);
      } catch {
        notifications.show({
          color: "red",
          message: "دریافت فهرست استان‌ها و شهرها ناموفق بود.",
        });
      }
    };
    void loadLocations();
  }, []);

  const availableCities = cities.filter(
    (city) => city.province_id.toString() === form.values.provinceId,
  );

  const handleSubmit = async (values: typeof form.values) => {
    if (processingImages) {
      notifications.show({
        color: "orange",
        message: "لطفاً تا پایان آماده‌سازی تصاویر صبر کنید.",
      });
      return;
    }

    setLoading(true);
    try {
      const imagesChanged =
        newImages.length > 0 || retainedImages.length !== initialImages.length;
      const { storageCleanupFailed } = await updateAd(
        ad.id,
        {
          category_id: Number(values.categoryId),
          city_id: Number(values.cityId),
          description: values.description.trim(),
          price: values.price ? Number(values.price) : null,
          province_id: Number(values.provinceId),
          title: values.title.trim(),
        },
        imagesChanged ? { newImages, retainedUrls: retainedImages } : undefined,
      );
      notifications.show({
        color: storageCleanupFailed ? "yellow" : "green",
        message: storageCleanupFailed
          ? "آگهی ویرایش شد، اما پاک‌سازی یکی از فایل‌های قدیمی انجام نشد."
          : "آگهی ویرایش شد و در صورت تغییر محتوا دوباره بررسی می‌شود.",
      });
      router.replace(`/ads/${ad.id}`);
      router.refresh();
    } catch (error) {
      notifications.show({
        color: "red",
        message:
          error instanceof Error ? error.message : "ویرایش آگهی ناموفق بود.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" my="xl" style={{ flex: 1, width: "100%" }}>
      <Paper p="xl" withBorder>
        <Title order={2} mb="xl">
          ویرایش آگهی
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput label="عنوان" {...form.getInputProps("title")} />
            <Select
              data={categories.map((category) => ({
                label: category.name,
                value: category.id.toString(),
              }))}
              label="دسته‌بندی"
              searchable
              {...form.getInputProps("categoryId")}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Select
                data={provinces.map((province) => ({
                  label: province.name,
                  value: province.id.toString(),
                }))}
                label="استان"
                onChange={(value) => {
                  form.setFieldValue("provinceId", value ?? "");
                  form.setFieldValue("cityId", "");
                }}
                searchable
                value={form.values.provinceId}
              />
              <Select
                data={availableCities.map((city) => ({
                  label: city.name,
                  value: city.id.toString(),
                }))}
                disabled={!form.values.provinceId}
                label="شهر"
                searchable
                {...form.getInputProps("cityId")}
              />
            </SimpleGrid>
            <TextInput
              inputMode="numeric"
              label="قیمت (تومان)"
              {...form.getInputProps("price")}
            />
            <Textarea
              autosize
              label="توضیحات"
              minRows={5}
              {...form.getInputProps("description")}
            />

            <Box>
              <Text fw={600} fz="sm" mb="xs">
                تصاویر فعلی
              </Text>
              {retainedImages.length ? (
                <Group gap="sm">
                  {retainedImages.map((url) => (
                    <Box key={url} pos="relative" h={100} w={100}>
                      <Image
                        alt="تصویر آگهی"
                        fill
                        sizes="100px"
                        src={url}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                      <ActionIcon
                        aria-label="حذف تصویر"
                        color="red"
                        onClick={() =>
                          setRetainedImages((current) =>
                            current.filter((imageUrl) => imageUrl !== url),
                          )
                        }
                        pos="absolute"
                        size="sm"
                        style={{ left: 6, top: 6, zIndex: 1 }}
                        variant="filled"
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Box>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" fz="sm">
                  تصویری باقی نمانده است.
                </Text>
              )}
            </Box>

            {retainedImages.length < 3 && (
              <AdsImageForm
                images={newImages}
                maxImages={3 - retainedImages.length}
                onProcessingChange={setProcessingImages}
                setImages={setNewImages}
              />
            )}
            <Button fullWidth loading={loading} type="submit">
              ذخیره تغییرات
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
