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
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconAt,
  IconEdit,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import EmailEdit from "./edit/EmailEdit";
import NameEdit from "./edit/NameEdit";
import PhoneEdit from "./edit/PhoneEdit";
import classes from "./user-detail.module.css";

export interface UserResponse {
  message: string;
  userData: UserData;
}

interface UserData {
  avatar_url: string | null;
  created_at: string;
  email: string | null;
  id: string;
  name: string;
  phone: string;
  updated_at: string;
}

interface DetailItemProps {
  actionLabel: string;
  emptyText: string;
  icon: React.ReactNode;
  label: string;
  onEdit: () => void;
  value: string | null;
}

function DetailItem({
  actionLabel,
  emptyText,
  icon,
  label,
  onEdit,
  value,
}: DetailItemProps) {
  return (
    <Card className={classes.detailCard} padding="md" radius="md" withBorder>
      <Group align="flex-start" wrap="nowrap">
        <ThemeIcon variant="light" size="lg" radius="md">
          {icon}
        </ThemeIcon>
        <Box flex={1} miw={0}>
          <Text c="dimmed" fz="xs" fw={500}>
            {label}
          </Text>
          <Text
            c={value ? undefined : "dimmed"}
            fw={value ? 600 : 400}
            mt={5}
            truncate
          >
            {value || emptyText}
          </Text>
        </Box>
        <ActionIcon aria-label={actionLabel} onClick={onEdit} variant="subtle">
          <IconEdit size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <Card mb="xl" padding="lg" radius="lg" withBorder>
      <Group mb="xl">
        <Skeleton circle height={64} />
        <Stack gap={8} flex={1}>
          <Skeleton height={18} maw={180} />
          <Skeleton height={12} maw={260} />
        </Stack>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} height={82} radius="md" />
        ))}
      </SimpleGrid>
    </Card>
  );
}

export default function UserDetail() {
  const [userData, setUserData] = useState<UserData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openedName, { open: openName, close: closeName }] =
    useDisclosure(false);
  const [openedEmail, { open: openEmail, close: closeEmail }] =
    useDisclosure(false);
  const [openedPhone, { open: openPhone, close: closePhone }] =
    useDisclosure(false);

  const fetchUserData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user-profile");
      const data = (await response.json()) as
        | UserResponse
        | { message?: string };
      if (!response.ok || !("userData" in data)) {
        throw new Error(data.message || "دریافت اطلاعات حساب ناموفق بود.");
      }
      setUserData(data.userData);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "دریافت اطلاعات حساب ناموفق بود.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUserData();
  }, []);

  if (loading && !userData) {
    return <ProfileSkeleton />;
  }

  if (error && !userData) {
    return (
      <Alert
        color="red"
        icon={<IconAlertCircle size={20} />}
        title="اطلاعات پروفایل بارگذاری نشد"
      >
        <Text fz="sm" mb="md">
          {error}
        </Text>
        <Button color="red" variant="light" onClick={fetchUserData}>
          تلاش دوباره
        </Button>
      </Alert>
    );
  }

  if (!userData) return null;

  const identity = userData.name || userData.email || "کاربر ریگورا";
  const joinedAt = new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "long",
  }).format(new Date(userData.created_at));

  return (
    <Card
      className={classes.wrapper}
      mb="xl"
      padding="lg"
      radius="lg"
      withBorder
    >
      <Flex
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        gap="md"
        mb="xl"
      >
        <Avatar color="green" radius="xl" size={64}>
          {identity.trim().charAt(0).toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <Group gap="xs">
            <Title order={3}>{identity}</Title>
            <Badge color="green" variant="light">
              حساب فعال
            </Badge>
          </Group>
          <Text c="dimmed" fz="sm" mt={4}>
            عضو ریگورا از {joinedAt}
          </Text>
        </Box>
      </Flex>

      {error && (
        <Alert color="orange" mb="md" title="به‌روزرسانی اطلاعات ناموفق بود">
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <DetailItem
          actionLabel="ویرایش نام نمایشی"
          emptyText="یک نام نمایشی انتخاب کنید"
          icon={<IconUser size={20} />}
          label="نام نمایشی"
          onEdit={openName}
          value={userData.name}
        />
        <DetailItem
          actionLabel="ویرایش ایمیل"
          emptyText="ایمیل ثبت نشده است"
          icon={<IconAt size={20} />}
          label="ایمیل ورود"
          onEdit={openEmail}
          value={userData.email}
        />
        <DetailItem
          actionLabel="ویرایش شماره تماس"
          emptyText="شماره تماس اختیاری است"
          icon={<IconPhone size={20} />}
          label="شماره تماس آگهی‌ها"
          onEdit={openPhone}
          value={userData.phone}
        />
      </SimpleGrid>

      <NameEdit
        fetchUserData={fetchUserData}
        close={closeName}
        opened={openedName}
      />
      <EmailEdit
        fetchUserData={fetchUserData}
        close={closeEmail}
        opened={openedEmail}
      />
      <PhoneEdit
        currentPhone={userData.phone}
        fetchUserData={fetchUserData}
        close={closePhone}
        opened={openedPhone}
      />
    </Card>
  );
}
