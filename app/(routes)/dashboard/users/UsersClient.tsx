"use client";

import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  Modal,
  Pagination,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconBan,
  IconCheck,
  IconCrown,
  IconDotsVertical,
  IconEdit,
  IconKey,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconUserCog,
  IconUsers,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { formatJalaliTimeAgo } from "../../../_utils/utils";
import {
  type AdminUser,
  type UserActionPayload,
  type UserRoleFilter,
  type UserStatusFilter,
  type UsersListResponse,
} from "../../../_features/users/types";
import classes from "./users.module.css";

const ROLE_OPTIONS: Array<{ label: string; value: UserRoleFilter }> = [
  { label: "همه نقش‌ها", value: "all" },
  { label: "کاربر", value: "user" },
  { label: "مدیر", value: "admin" },
];

const STATUS_OPTIONS: Array<{ label: string; value: UserStatusFilter }> = [
  { label: "همه", value: "all" },
  { label: "فعال", value: "active" },
  { label: "مسدود", value: "banned" },
];

function readMessage(body: unknown): string | undefined {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return undefined;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "عملیات ناموفق بود. دوباره تلاش کنید.";
}

interface UsersClientProps {
  currentUserId: string | null;
}

export default function UsersClient({ currentUserId }: UsersClientProps) {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRoleFilter>("all");
  const [status, setStatus] = useState<UserStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const [result, setResult] = useState<UsersListResponse>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [pendingId, setPendingId] = useState<string>();

  const [editTarget, setEditTarget] = useState<AdminUser>();
  const [banTarget, setBanTarget] = useState<AdminUser>();
  const [banReason, setBanReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser>();
  const [editOpened, editHandlers] = useDisclosure(false);
  const [banOpened, banHandlers] = useDisclosure(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [query, role, status]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(undefined);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (query) params.set("search", query);
      if (role !== "all") params.set("role", role);
      if (status !== "all") params.set("status", status);
      const response = await fetch(`/api/dashboard/users?${params.toString()}`);
      const body = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) {
        throw new Error(readMessage(body) ?? "دریافت کاربران ناموفق بود.");
      }
      setResult(body as UsersListResponse);
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, query, role, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const request = async (
    user: AdminUser,
    payload: UserActionPayload,
    successMessage: string,
  ) => {
    setPendingId(user.id);
    try {
      const response = await fetch(`/api/dashboard/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(readMessage(body) ?? "عملیات ناموفق بود.");
      }
      notifications.show({ color: "green", message: successMessage });
      await load();
      return true;
    } catch (error) {
      notifications.show({ color: "red", message: errorMessage(error) });
      return false;
    } finally {
      setPendingId(undefined);
    }
  };

  const toggleRole = (user: AdminUser) =>
    void request(
      user,
      { action: "set_role", role: user.role === "admin" ? "user" : "admin" },
      user.role === "admin"
        ? "دسترسی مدیریت حذف شد."
        : "دسترسی مدیریت داده شد.",
    );

  const banUser = async () => {
    if (!banTarget) return;
    const done = await request(
      banTarget,
      { action: "set_ban", ban_reason: banReason },
      "کاربر مسدود شد.",
    );
    if (done) {
      setBanTarget(undefined);
      setBanReason("");
      banHandlers.close();
    }
  };

  const unbanUser = (user: AdminUser) =>
    void request(user, { action: "unban" }, "مسدودی کاربر برداشته شد.");

  const sendReset = async (user: AdminUser) => {
    setPendingId(user.id);
    try {
      const response = await fetch(
        `/api/dashboard/users/${user.id}/password-reset`,
        { method: "POST" },
      );
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(readMessage(body) ?? "ارسال ایمیل ناموفق بود.");
      }
      const email =
        body && typeof body === "object" && "email" in body
          ? (body as { email?: unknown }).email
          : undefined;
      notifications.show({
        color: "green",
        message: `ایمیل بازیابی رمز به ${
          typeof email === "string" ? email : "کاربر"
        } ارسال شد.`,
      });
    } catch (error) {
      notifications.show({ color: "red", message: errorMessage(error) });
    } finally {
      setPendingId(undefined);
    }
  };

  const removeUser = async () => {
    if (!deleteTarget) return;
    setPendingId(deleteTarget.id);
    try {
      const response = await fetch(`/api/dashboard/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(readMessage(body) ?? "حذف کاربر ناموفق بود.");
      }
      setDeleteTarget(undefined);
      notifications.show({ color: "green", message: "حساب کاربر حذف شد." });
      await load();
    } catch (error) {
      notifications.show({ color: "red", message: errorMessage(error) });
    } finally {
      setPendingId(undefined);
    }
  };

  const users = result?.data ?? [];
  const summary = result?.summary;

  return (
    <Stack gap="lg">
      <Group align="flex-end" justify="space-between">
        <div>
          <Text c="dimmed" fz="sm" fw={600}>
            اعضا
          </Text>
          <Title order={1} size="h2">
            مدیریت کاربران
          </Title>
          <Text c="dimmed" fz="sm" mt={4}>
            جستجوی کاربران، ویرایش پروفایل، نقش‌بندی و مسدودسازی حساب‌ها
          </Text>
        </div>
        <ActionIcon
          aria-label="به‌روزرسانی فهرست کاربران"
          loading={loading}
          onClick={() => void load()}
          size="lg"
          variant="light"
        >
          <IconRefresh size={18} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 3 }}>
        <SummaryCard
          color="blue"
          icon={IconUsers}
          label="کل کاربران"
          value={summary?.total}
        />
        <SummaryCard
          color="grape"
          icon={IconCrown}
          label="مدیران"
          value={summary?.admins}
        />
        <SummaryCard
          color="red"
          icon={IconBan}
          label="کاربران مسدود"
          value={summary?.banned}
        />
      </SimpleGrid>

      <Paper p="md" radius="lg" withBorder>
        <Flex
          align={{ base: "stretch", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap="md"
          justify="space-between"
        >
          <Group gap="sm">
            <SegmentedControl
              className={classes.statusControl}
              data={ROLE_OPTIONS}
              onChange={(value) => setRole(value as UserRoleFilter)}
              value={role}
            />
            <SegmentedControl
              className={classes.statusControl}
              data={STATUS_OPTIONS}
              onChange={(value) => setStatus(value as UserStatusFilter)}
              value={status}
            />
          </Group>
          <TextInput
            leftSection={<IconSearch size={16} />}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="جستجو بر اساس نام، ایمیل یا شماره"
            value={search}
            w={{ base: "100%", md: 300 }}
          />
        </Flex>
      </Paper>

      {loadError ? (
        <Alert
          color="red"
          icon={<IconAlertCircle size={20} />}
          title="دریافت کاربران ناموفق بود"
        >
          <Text fz="sm" mb="md">
            {loadError}
          </Text>
          <Button onClick={() => void load()} variant="light">
            تلاش دوباره
          </Button>
        </Alert>
      ) : loading && !result ? (
        <Stack gap="sm">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton height={64} key={index} radius="lg" />
          ))}
        </Stack>
      ) : users.length ? (
        <>
          <Paper p="md" radius="lg" withBorder>
            <Box className={classes.tableScroll}>
              <Table highlightOnHover miw={860} verticalSpacing="sm">
                <TableThead>
                  <TableTr>
                    <TableTh>کاربر</TableTh>
                    <TableTh>وضعیت</TableTh>
                    <TableTh>تماس</TableTh>
                    <TableTh>فعالیت</TableTh>
                    <TableTh>عضویت</TableTh>
                    <TableTh w={60} />
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {users.map((user) => (
                    <UserRow
                      currentUserId={currentUserId}
                      key={user.id}
                      loading={pendingId === user.id}
                      onBan={() => {
                        setBanTarget(user);
                        banHandlers.open();
                      }}
                      onDelete={() => setDeleteTarget(user)}
                      onEdit={() => {
                        setEditTarget(user);
                        editHandlers.open();
                      }}
                      onReset={() => void sendReset(user)}
                      onToggleRole={() => toggleRole(user)}
                      onUnban={() => unbanUser(user)}
                      user={user}
                    />
                  ))}
                </TableTbody>
              </Table>
            </Box>
          </Paper>

          {(result?.lastPage ?? 1) > 1 && (
            <Flex justify="center">
              <Pagination
                onChange={setPage}
                total={result?.lastPage ?? 1}
                value={page}
              />
            </Flex>
          )}
        </>
      ) : (
        <Paper className={classes.emptyState} p="xl" radius="lg" withBorder>
          <IconUsers size={42} stroke={1.4} />
          <Title order={3} size="h4" mt="md">
            کاربری یافت نشد
          </Title>
          <Text c="dimmed" fz="sm" mt="xs" ta="center">
            نقش، وضعیت یا عبارت جستجو را تغییر دهید.
          </Text>
        </Paper>
      )}

      <EditProfileModal
        loading={Boolean(editTarget) && pendingId === editTarget?.id}
        onClose={() => {
          editHandlers.close();
          setEditTarget(undefined);
        }}
        onSubmit={async (values) => {
          if (!editTarget) return;
          const done = await request(
            editTarget,
            { action: "update_profile", ...values },
            "پروفایل کاربر به‌روزرسانی شد.",
          );
          if (done) {
            editHandlers.close();
            setEditTarget(undefined);
          }
        }}
        opened={editOpened}
        user={editTarget}
      />

      <Modal
        centered
        onClose={() => {
          banHandlers.close();
          setBanTarget(undefined);
          setBanReason("");
        }}
        opened={banOpened}
        title="مسدودسازی کاربر"
      >
        <Text fz="sm" mb="md">
          حساب «{banTarget?.display_name || banTarget?.email}» غیرفعال می‌شود و
          امکان ورود آن تا برداشتن مسدودی وجود نخواهد بود.
        </Text>
        <TextInput
          label="دلیل مسدودسازی (اختیاری)"
          maxLength={200}
          onChange={(event) => setBanReason(event.currentTarget.value)}
          placeholder="مثلاً ارسال آگهی جعلی"
          value={banReason}
        />
        <Group justify="flex-end" mt="lg">
          <Button
            color="gray"
            onClick={() => {
              banHandlers.close();
              setBanTarget(undefined);
              setBanReason("");
            }}
            variant="subtle"
          >
            انصراف
          </Button>
          <Button
            color="red"
            leftSection={<IconBan size={16} />}
            loading={Boolean(banTarget) && pendingId === banTarget?.id}
            onClick={() => void banUser()}
          >
            مسدود کن
          </Button>
        </Group>
      </Modal>

      <Modal
        centered
        onClose={() => setDeleteTarget(undefined)}
        opened={Boolean(deleteTarget)}
        title="حذف دائمی حساب"
      >
        <Text fz="sm">
          حساب «{deleteTarget?.display_name || deleteTarget?.email}» به همراه
          آگهی‌ها، مقالات و گفت‌وگوهای مرتبط برای همیشه حذف می‌شود. این عملیات
          قابل بازگشت نیست.
        </Text>
        <Alert color="orange" mt="md" variant="light">
          <Text fz="xs">
            اگر فقط می‌خواهید دسترسی کاربر را ببندید، از گزینه مسدودسازی استفاده
            کنید.
          </Text>
        </Alert>
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
            leftSection={<IconTrash size={16} />}
            loading={Boolean(deleteTarget) && pendingId === deleteTarget?.id}
            onClick={() => void removeUser()}
          >
            حذف دائمی
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}

function SummaryCard({
  color,
  icon: Icon,
  label,
  value,
}: {
  color: string;
  icon: typeof IconUsers;
  label: string;
  value?: number;
}) {
  return (
    <Card padding="lg" radius="lg" withBorder>
      <Group justify="space-between">
        <div>
          <Text c="dimmed" fz="sm">
            {label}
          </Text>
          <Text fw={800} fz={30} mt={4}>
            {(value ?? 0).toLocaleString("fa-IR")}
          </Text>
        </div>
        <ThemeIcon color={color} radius="lg" size={48} variant="light">
          <Icon size={25} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}

interface UserRowProps {
  currentUserId: string | null;
  loading: boolean;
  onBan: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onReset: () => void;
  onToggleRole: () => void;
  onUnban: () => void;
  user: AdminUser;
}

function UserRow({
  currentUserId,
  loading,
  onBan,
  onDelete,
  onEdit,
  onReset,
  onToggleRole,
  onUnban,
  user,
}: UserRowProps) {
  const isSelf = user.id === currentUserId;
  const label = user.display_name || user.email || "کاربر ریگورا";
  const initial = label.charAt(0).toUpperCase();

  return (
    <TableTr>
      <TableTd>
        <div className={classes.userCell}>
          <Avatar color="green" radius="xl" size={38} src={user.avatar_url}>
            {initial}
          </Avatar>
          <div className={classes.userCellText}>
            <Group gap={6} wrap="nowrap">
              <Text fw={700} fz="sm" lineClamp={1}>
                {label}
              </Text>
              {isSelf && (
                <Badge color="blue" size="xs" variant="light">
                  شما
                </Badge>
              )}
            </Group>
            <Text c="dimmed" fz="xs" lineClamp={1}>
              {user.email ?? "بدون ایمیل"}
            </Text>
          </div>
        </div>
      </TableTd>
      <TableTd>
        <Group gap={6}>
          {user.role === "admin" ? (
            <Badge
              color="grape"
              leftSection={<IconCrown size={12} />}
              variant="light"
            >
              مدیر
            </Badge>
          ) : (
            <Badge color="gray" variant="light">
              کاربر
            </Badge>
          )}
          {user.status === "banned" ? (
            <Badge
              color="red"
              leftSection={<IconBan size={12} />}
              variant="light"
            >
              مسدود
            </Badge>
          ) : (
            <Badge
              color="teal"
              leftSection={<IconCheck size={12} />}
              variant="light"
            >
              فعال
            </Badge>
          )}
        </Group>
        {user.status === "banned" && user.ban_reason && (
          <Text c="dimmed" fz={10} mt={4} lineClamp={1}>
            {user.ban_reason}
          </Text>
        )}
      </TableTd>
      <TableTd>
        <Text fz="sm">{user.phone ?? "ثبت نشده"}</Text>
      </TableTd>
      <TableTd>
        <div className={classes.activityCell}>
          <Badge color="blue" size="xs" variant="light">
            {user.activity.ads_count.toLocaleString("fa-IR")} آگهی
          </Badge>
          <Badge color="cyan" size="xs" variant="light">
            {user.activity.articles_count.toLocaleString("fa-IR")} مقاله
          </Badge>
          <Badge color="gray" size="xs" variant="light">
            {user.activity.conversations_count.toLocaleString("fa-IR")} گفت‌وگو
          </Badge>
        </div>
      </TableTd>
      <TableTd>
        <Text fz="xs">{formatJalaliTimeAgo(user.created_at)}</Text>
        <Text c="dimmed" fz={10} mt={2}>
          {user.last_sign_in_at
            ? `آخرین ورود ${formatJalaliTimeAgo(user.last_sign_in_at)}`
            : "بدون ورود"}
        </Text>
      </TableTd>
      <TableTd>
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon
              aria-label={`گزینه‌های ${label}`}
              loading={loading}
              variant="subtle"
            >
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEdit size={16} />} onClick={onEdit}>
              ویرایش پروفایل
            </Menu.Item>
            <Menu.Item
              leftSection={<IconUserCog size={16} />}
              onClick={onToggleRole}
            >
              {user.role === "admin"
                ? "حذف دسترسی مدیریت"
                : "اعطای دسترسی مدیریت"}
            </Menu.Item>
            <Menu.Item
              disabled={isSelf || !user.email}
              leftSection={<IconKey size={16} />}
              onClick={onReset}
            >
              ارسال ایمیل بازیابی رمز
            </Menu.Item>
            {user.status === "banned" ? (
              <Menu.Item
                disabled={isSelf}
                leftSection={<IconCheck size={16} />}
                onClick={onUnban}
              >
                برداشتن مسدودی
              </Menu.Item>
            ) : (
              <Menu.Item
                color="orange"
                disabled={isSelf}
                leftSection={<IconBan size={16} />}
                onClick={onBan}
              >
                مسدودسازی
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item
              color="red"
              disabled={isSelf}
              leftSection={<IconTrash size={16} />}
              onClick={onDelete}
            >
              حذف دائمی
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </TableTd>
    </TableTr>
  );
}

interface EditProfileModalProps {
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: { display_name: string; phone: string }) => Promise<void>;
  opened: boolean;
  user?: AdminUser;
}

function EditProfileModal({
  loading,
  onClose,
  onSubmit,
  opened,
  user,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (opened && user) {
      setDisplayName(user.display_name ?? "");
      setPhone(user.phone ?? "");
    }
  }, [opened, user]);

  return (
    <Modal
      centered
      onClose={onClose}
      opened={opened}
      title={
        user
          ? `ویرایش پروفایل: ${user.display_name || user.email || "کاربر"}`
          : "ویرایش پروفایل"
      }
    >
      <Stack gap="md">
        <TextInput
          label="نام نمایشی"
          maxLength={80}
          onChange={(event) => setDisplayName(event.currentTarget.value)}
          placeholder="نام کاربر"
          value={displayName}
        />
        <TextInput
          dir="ltr"
          label="شماره تماس"
          maxLength={13}
          onChange={(event) => setPhone(event.currentTarget.value)}
          placeholder="09123456789"
          value={phone}
        />
        {user?.email && (
          <Text c="dimmed" fz="xs">
            ایمیل از حساب احراز هویت خوانده می‌شود و قابل ویرایش نیست.
          </Text>
        )}
        <Group justify="flex-end" mt="sm">
          <Button color="gray" onClick={onClose} variant="subtle">
            انصراف
          </Button>
          <Button
            loading={loading}
            onClick={() => void onSubmit({ display_name: displayName, phone })}
          >
            ذخیره تغییرات
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
