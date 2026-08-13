"use client";

import type { Product } from "../../../_features/ads/types";
import type { AdStatus } from "../../../types/database.types";
import {
  useApproveAdsItem,
  useGetAdsListQuery,
  useRejectAdsItem,
  useRemoveAds,
} from "../../../_redux/services/adsApi";
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
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconDotsVertical,
  IconEye,
  IconPhoto,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
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
  const [detailsOpened, details] = useDisclosure(false);

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
    </Stack>
  );
}

interface ModerationCardProps {
  actionLoading: boolean;
  ad: Product;
  onApprove: () => void;
  onDelete: () => void;
  onOpen: () => void;
  onReject: () => void;
}

function ModerationCard({
  actionLoading,
  ad,
  onApprove,
  onDelete,
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
        <Button onClick={onOpen} size="xs" variant="default">
          جزئیات
        </Button>
      </Group>
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
