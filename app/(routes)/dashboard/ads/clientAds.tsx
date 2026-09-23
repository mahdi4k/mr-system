"use client";

import type { Product } from "../../../_features/ads/types";
import type { AdStatus } from "../../../types/database.types";
import {
  useApproveAdsItem,
  useGetAdsListQuery,
  useRejectAdsItem,
  useRemoveAds,
} from "../../../_redux/services/adsApi";
import AdsImageForm from "@/_components/adsSection/AdsImageForm";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Image,
  Menu,
  Modal,
  Pagination,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPhoto,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import NextImage from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import classes from "./moderation.module.css";

const STATUS_OPTIONS: Array<{
  color: string;
  label: string;
  value: AdStatus | "all";
}> = [
  { color: "gray", label: "همه", value: "all" },
  { color: "orange", label: "در انتظار", value: "pending" },
  { color: "green", label: "منتشرشده", value: "published" },
  { color: "red", label: "ردشده", value: "rejected" },
  { color: "blue", label: "فروخته‌شده", value: "sold" },
  { color: "gray", label: "بایگانی", value: "archived" },
];

function parseImages(image?: string): string[] {
  if (!image) return [];
  try {
    const parsed = JSON.parse(image) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error && "error" in error) {
    const message = (error as { error?: unknown }).error;
    if (typeof message === "string") return message;
  }
  return "عملیات ناموفق بود. دوباره تلاش کنید.";
}

export default function ClientAds() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AdStatus | "all">("pending");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [selectedAd, setSelectedAd] = useState<Product>();
  const [deleteTarget, setDeleteTarget] = useState<Product>();
  const [editTarget, setEditTarget] = useState<Product>();
  const [detailsOpened, details] = useDisclosure(false);
  const [editOpened, editHandlers] = useDisclosure(false);

  const query = useGetAdsListQuery({
    page,
    search: deferredSearch || undefined,
    status: status === "all" ? undefined : status,
  });
  const [approve, approveState] = useApproveAdsItem();
  const [reject, rejectState] = useRejectAdsItem();
  const [remove, removeState] = useRemoveAds();
  const actionLoading =
    approveState.isLoading || rejectState.isLoading || removeState.isLoading;

  useEffect(() => setPage(1), [deferredSearch, status]);

  const runAction = async (
    action: "approve" | "reject" | "delete",
    ad: Product,
  ) => {
    try {
      if (action === "approve") await approve({ id: ad.id }).unwrap();
      if (action === "reject") await reject({ id: ad.id }).unwrap();
      if (action === "delete") await remove(ad.id).unwrap();
      notifications.show({
        color: "green",
        message:
          action === "approve"
            ? "آگهی منتشر شد."
            : action === "reject"
              ? "آگهی رد شد."
              : "آگهی حذف شد.",
      });
      if (action === "delete") setDeleteTarget(undefined);
    } catch (actionError) {
      notifications.show({ color: "red", message: errorMessage(actionError) });
    }
  };

  const openDetails = (ad: Product) => {
    setSelectedAd(ad);
    details.open();
  };

  const openEdit = (ad: Product) => {
    setEditTarget(ad);
    editHandlers.open();
  };

  return (
    <Stack gap="lg">
      <Group align="flex-end" justify="space-between">
        <div>
          <Text c="dimmed" fz="sm" fw={600}>
            بازار
          </Text>
          <Title order={1} size="h2">
            مدیریت آگهی‌ها
          </Title>
          <Text c="dimmed" fz="sm" mt={4}>
            بررسی، انتشار و مدیریت آگهی‌های کاربران
          </Text>
        </div>
        <ActionIcon
          aria-label="به‌روزرسانی آگهی‌ها"
          loading={query.isFetching}
          onClick={query.refetch}
          size="lg"
          variant="light"
        >
          <IconRefresh size={18} />
        </ActionIcon>
      </Group>

      <Paper p="md" radius="lg" withBorder>
        <Flex
          align={{ base: "stretch", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap="md"
          justify="space-between"
        >
          <SegmentedControl
            className={classes.statusControl}
            data={STATUS_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={(value) => setStatus(value as AdStatus | "all")}
            value={status}
          />
          <TextInput
            leftSection={<IconSearch size={16} />}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="جستجو در عنوان آگهی"
            value={search}
            w={{ base: "100%", md: 280 }}
          />
        </Flex>
      </Paper>

      {query.isError ? (
        <Alert
          color="red"
          icon={<IconAlertCircle size={20} />}
          title="دریافت آگهی‌ها ناموفق بود"
        >
          <Text fz="sm" mb="md">
            {errorMessage(query.error)}
          </Text>
          <Button onClick={query.refetch} variant="light">
            تلاش دوباره
          </Button>
        </Alert>
      ) : query.isLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton height={350} key={index} radius="lg" />
          ))}
        </SimpleGrid>
      ) : query.data?.data.length ? (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
            {query.data.data.map((ad) => (
              <ModerationCard
                actionLoading={actionLoading}
                ad={ad}
                key={ad.id}
                onApprove={() => void runAction("approve", ad)}
                onDelete={() => setDeleteTarget(ad)}
                onEdit={() => openEdit(ad)}
                onOpen={() => openDetails(ad)}
                onReject={() => void runAction("reject", ad)}
              />
            ))}
          </SimpleGrid>
          {query.data.last_page > 1 && (
            <Flex justify="center">
              <Pagination
                onChange={setPage}
                total={query.data.last_page}
                value={page}
              />
            </Flex>
          )}
        </>
      ) : (
        <Paper className={classes.emptyState} p="xl" radius="lg" withBorder>
          <IconSearch size={42} stroke={1.4} />
          <Title order={3} size="h4" mt="md">
            آگهی‌ای در این صف نیست
          </Title>
          <Text c="dimmed" fz="sm" mt="xs" ta="center">
            وضعیت یا عبارت جستجو را تغییر دهید.
          </Text>
        </Paper>
      )}

      <Modal
        centered
        onClose={details.close}
        opened={detailsOpened}
        size="lg"
        title="جزئیات آگهی"
      >
        {selectedAd && <AdDetails ad={selectedAd} />}
      </Modal>

      <Modal
        centered
        onClose={() => setDeleteTarget(undefined)}
        opened={Boolean(deleteTarget)}
        title="حذف دائمی آگهی"
      >
        <Text fz="sm">
          آگهی «{deleteTarget?.title}» و تصاویر آن برای همیشه حذف می‌شوند. این
          عملیات قابل بازگشت نیست.
        </Text>
        <Group justify="flex-end" mt="lg">
          <Button
            color="gray"
            onClick={() => setDeleteTarget(undefined)}
            variant="subtle"
          >
            انصراف
          </Button>
          <Button
            color="red"
            loading={removeState.isLoading}
            onClick={() =>
              deleteTarget && void runAction("delete", deleteTarget)
            }
          >
            حذف دائمی
          </Button>
        </Group>
      </Modal>

      <Modal
        centered
        onClose={() => {
          editHandlers.close();
          setEditTarget(undefined);
        }}
        opened={editOpened}
        size="xl"
        title={editTarget ? `ویرایش: ${editTarget.title}` : "ویرایش آگهی"}
        scrollAreaComponent={Box}
      >
        {editTarget && (
          <AdminEditForm
            ad={editTarget}
            onCancel={() => {
              editHandlers.close();
              setEditTarget(undefined);
            }}
            onSuccess={() => {
              editHandlers.close();
              setEditTarget(undefined);
              void query.refetch();
            }}
          />
        )}
      </Modal>
    </Stack>
  );
}

interface ModerationCardProps {
  actionLoading: boolean;
  ad: Product;
  onApprove: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onOpen: () => void;
  onReject: () => void;
}

function ModerationCard({
  actionLoading,
  ad,
  onApprove,
  onDelete,
  onEdit,
  onOpen,
  onReject,
}: ModerationCardProps) {
  const images = parseImages(ad.image);
  const status = STATUS_OPTIONS.find(({ value }) => value === ad.status)!;
  return (
    <Card className={classes.card} padding="md" radius="lg" withBorder>
      <Card.Section className={classes.imageSection}>
        {images[0] ? (
          <Image alt={ad.title} fit="cover" h="100%" src={images[0]} />
        ) : (
          <Flex align="center" c="dimmed" h="100%" justify="center">
            <IconPhoto size={35} stroke={1.3} />
          </Flex>
        )}
        <Badge
          className={classes.statusBadge}
          color={status.color}
          variant="filled"
        >
          {status.label}
        </Badge>
      </Card.Section>

      <Group justify="space-between" mt="md" wrap="nowrap">
        <Box miw={0}>
          <Text fw={700} lineClamp={1}>
            {ad.title}
          </Text>
          <Text c="dimmed" fz="xs" mt={3}>
            {ad.category.name} · {ad.user.name}
          </Text>
        </Box>
        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon aria-label="گزینه‌های آگهی" variant="subtle">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              component={Link}
              href={`/ads/${ad.id}`}
              leftSection={<IconEye size={16} />}
            >
              مشاهده صفحه عمومی
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={16} />} onClick={onEdit}>
              ویرایش کامل
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={onDelete}
            >
              حذف دائمی
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Text c="dimmed" fz="sm" lineClamp={2} mih={44} mt="md">
        {ad.description}
      </Text>
      <Group justify="space-between" mt="md">
        <Text fw={700} fz="sm">
          {ad.price
            ? `${Number(ad.price).toLocaleString("fa-IR")} تومان`
            : "قیمت توافقی"}
        </Text>
        <Text c="dimmed" fz="xs">
          {new Intl.DateTimeFormat("fa-IR").format(new Date(ad.created_at))}
        </Text>
      </Group>

      <Group grow mt="md">
        <Button
          disabled={actionLoading || ad.status === "published"}
          leftSection={<IconCheck size={17} />}
          onClick={onApprove}
          size="xs"
          variant="light"
        >
          انتشار
        </Button>
        <Button
          color="red"
          disabled={actionLoading || ad.status === "rejected"}
          leftSection={<IconX size={17} />}
          onClick={onReject}
          size="xs"
          variant="light"
        >
          رد کردن
        </Button>
        <Button
          leftSection={<IconEdit size={16} />}
          onClick={onEdit}
          size="xs"
          variant="light"
        >
          ویرایش
        </Button>
      </Group>
      <Button fullWidth mt="sm" onClick={onOpen} size="xs" variant="default">
        جزئیات
      </Button>
    </Card>
  );
}

function AdDetails({ ad }: { ad: Product }) {
  const images = parseImages(ad.image);
  return (
    <Stack>
      {images.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3 }}>
          {images.map((image) => (
            <Image alt={ad.title} h={150} key={image} radius="md" src={image} />
          ))}
        </SimpleGrid>
      )}
      <div>
        <Text c="dimmed" fz="xs">
          عنوان
        </Text>
        <Text fw={700}>{ad.title}</Text>
      </div>
      <div>
        <Text c="dimmed" fz="xs">
          توضیحات
        </Text>
        <Text fz="sm" style={{ whiteSpace: "pre-wrap" }}>
          {ad.description}
        </Text>
      </div>
      <Group grow>
        <div>
          <Text c="dimmed" fz="xs">
            فروشنده
          </Text>
          <Text fz="sm">{ad.user.name}</Text>
        </div>
        <div>
          <Text c="dimmed" fz="xs">
            شماره تماس
          </Text>
          <Text fz="sm">{ad.user.phone || "ثبت نشده"}</Text>
        </div>
      </Group>
    </Stack>
  );
}

function AdminEditForm({
  ad,
  onCancel,
  onSuccess,
}: {
  ad: Product;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const initialImages = parseImages(ad.image);
  const [provinces, setProvinces] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [cities, setCities] = useState<
    Array<{ id: number; name: string; province_id: number }>
  >([]);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [retainedImages, setRetainedImages] = useState<string[]>(initialImages);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [processingImages, setProcessingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(true);

  const [title, setTitle] = useState(ad.title);
  const [description, setDescription] = useState(ad.description);
  const [price, setPrice] = useState(ad.price);
  const [categoryId, setCategoryId] = useState(ad.category.id.toString());
  const [provinceId, setProvinceId] = useState(ad.ostan);
  const [cityId, setCityId] = useState(ad.city);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [provRes, cityRes, catRes] = await Promise.all([
          fetch("/provinces.json"),
          fetch("/cities.json"),
          fetch("/api/catalog/cpu")
            .then(() => null)
            .catch(() => null),
        ]);
        // Fallback to direct supabase for categories if API fails
        let cats: Array<{ id: number; name: string }> = [];
        try {
          const { createClient } = await import(
            "../../../_lib/supabase/client"
          );
          const supabase = createClient();
          const { data } = await supabase
            .from("ad_categories")
            .select("id, name")
            .eq("is_active", true)
            .order("sort_order");
          if (data) cats = data;
        } catch {}
        // Also try to fetch via supabase directly as fallback
        if (cats.length === 0) {
          cats = [
            { id: 1, name: "پردازنده (CPU)" },
            { id: 2, name: "کارت گرافیک (GPU)" },
            { id: 3, name: "مادربرد" },
            { id: 4, name: "حافظه رم (RAM)" },
            { id: 5, name: "منبع تغذیه (Power)" },
            { id: 6, name: "کیس (Case)" },
            { id: 7, name: "خنک‌کننده (Cooler)" },
            { id: 8, name: "حافظه SSD" },
          ];
        }
        setCategories(cats);
        if (provRes?.ok)
          setProvinces(
            (await provRes.json()) as Array<{ id: number; name: string }>,
          );
        if (cityRes?.ok)
          setCities(
            (await cityRes.json()) as Array<{
              id: number;
              name: string;
              province_id: number;
            }>,
          );
      } catch {
        // ignore
      } finally {
        setFetchingMeta(false);
      }
    };
    void loadMeta();
  }, []);

  const availableCities = cities.filter(
    (c) => c.province_id.toString() === provinceId,
  );

  const handleSubmit = async () => {
    if (processingImages) {
      notifications.show({
        color: "orange",
        message: "لطفاً تا پایان آماده‌سازی تصاویر صبر کنید.",
      });
      return;
    }
    if (title.trim().length < 3 || title.trim().length > 120) {
      notifications.show({
        color: "red",
        message: "عنوان باید بین ۳ تا ۱۲۰ نویسه باشد",
      });
      return;
    }
    if (description.trim().length < 10 || description.trim().length > 5000) {
      notifications.show({
        color: "red",
        message: "توضیحات باید بین ۱۰ تا ۵۰۰۰ نویسه باشد",
      });
      return;
    }
    if (price && !/^\d+$/.test(price)) {
      notifications.show({ color: "red", message: "قیمت معتبر نیست" });
      return;
    }
    if (!categoryId || !provinceId || !cityId) {
      notifications.show({
        color: "red",
        message: "دسته‌بندی، استان و شهر الزامی است",
      });
      return;
    }
    if (retainedImages.length + newImages.length > 3) {
      notifications.show({ color: "red", message: "حداکثر ۳ تصویر مجاز است" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category_id", categoryId);
      formData.append("province_id", provinceId);
      formData.append("city_id", cityId);
      formData.append("retainedUrls", JSON.stringify(retainedImages));
      newImages.forEach((file) => formData.append("newImages", file));

      const res = await fetch(`/api/dashboard/ads/${ad.id}`, {
        method: "PATCH",
        body: formData,
      });
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (!res.ok) throw new Error(body?.message || "ویرایش ناموفق بود");

      notifications.show({
        color: "green",
        message: "آگهی با موفقیت ویرایش شد",
      });
      onSuccess();
    } catch (e) {
      notifications.show({
        color: "red",
        message: e instanceof Error ? e.message : "ویرایش ناموفق بود",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingMeta) {
    return (
      <Stack>
        <Skeleton height={40} />
        <Skeleton height={200} />
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <TextInput
        label="عنوان"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        maxLength={120}
      />
      <Select
        label="دسته‌بندی"
        data={categories.map((c) => ({
          value: c.id.toString(),
          label: c.name,
        }))}
        value={categoryId}
        onChange={(v) => v && setCategoryId(v)}
        searchable
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Select
          label="استان"
          data={provinces.map((p) => ({
            value: p.id.toString(),
            label: p.name,
          }))}
          value={provinceId}
          onChange={(v) => {
            setProvinceId(v ?? "");
            setCityId("");
          }}
          searchable
        />
        <Select
          label="شهر"
          data={availableCities.map((c) => ({
            value: c.id.toString(),
            label: c.name,
          }))}
          value={cityId}
          onChange={(v) => v && setCityId(v)}
          searchable
          disabled={!provinceId}
        />
      </SimpleGrid>
      <TextInput
        label="قیمت (تومان) - خالی برای توافقی"
        value={price}
        onChange={(e) => setPrice(e.currentTarget.value)}
        inputMode="numeric"
      />
      <Textarea
        label="توضیحات"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        minRows={5}
        autosize
      />

      <Box>
        <Text fw={600} fz="sm" mb="xs">
          تصاویر فعلی ({retainedImages.length}/3)
        </Text>
        {retainedImages.length ? (
          <Group gap="sm">
            {retainedImages.map((url) => (
              <Box key={url} pos="relative" h={100} w={100}>
                <NextImage
                  alt="تصویر آگهی"
                  src={url}
                  fill
                  sizes="100px"
                  style={{ borderRadius: 8, objectFit: "cover" }}
                  unoptimized
                />
                <ActionIcon
                  aria-label="حذف تصویر"
                  color="red"
                  onClick={() =>
                    setRetainedImages((cur) => cur.filter((u) => u !== url))
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

      <Group justify="flex-end" mt="md">
        <Button
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={loading}
        >
          انصراف
        </Button>
        <Button loading={loading} onClick={handleSubmit}>
          ذخیره تغییرات
        </Button>
      </Group>
    </Stack>
  );
}
