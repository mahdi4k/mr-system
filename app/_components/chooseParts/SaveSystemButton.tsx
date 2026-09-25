"use client";

import {
  Button,
  Group,
  Modal,
  Text,
  TextInput,
  Stack,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconEye, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../_lib/supabase/client";

interface SaveSystemButtonProps {
  disabled?: boolean;
}

export default function SaveSystemButton({ disabled }: SaveSystemButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasParts =
    searchParams.has("cpu") ||
    searchParams.has("motherboard") ||
    searchParams.has("graphic") ||
    searchParams.has("power") ||
    searchParams.has("ram") ||
    searchParams.has("fan") ||
    searchParams.has("ssd") ||
    searchParams.has("case");

  const handleSave = async () => {
    if (!hasParts) {
      notifications.show({
        color: "orange",
        message: "ابتدا قطعه‌ای انتخاب کنید",
      });
      return;
    }
    if (name.trim().length < 2 || name.trim().length > 50) {
      notifications.show({
        color: "red",
        message: "نام سیستم باید بین ۲ تا ۵۰ نویسه باشد",
      });
      return;
    }

    const config: Record<string, string> = {};
    const keys = [
      "cpu",
      "motherboard",
      "ram",
      "graphic",
      "power",
      "ssd",
      "case",
      "fan",
      "ramQuantity",
    ] as const;
    for (const key of keys) {
      const value = searchParams.get(key);
      if (value) config[key] = value;
    }

    if (Object.keys(config).length === 0) {
      notifications.show({
        color: "red",
        message: "سیستمی برای ذخیره وجود ندارد",
      });
      return;
    }

    setLoading(true);
    try {
      // check auth
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/choose-part?" + searchParams.toString());
        return;
      }

      const res = await fetch("/api/saved-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), config }),
      });
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (!res.ok) throw new Error(body?.message || "ذخیره ناموفق بود");

      notifications.show({
        color: "green",
        message: `سیستم "${name.trim()}" ذخیره شد`,
      });
      setName("");
      close();
    } catch (e) {
      notifications.show({
        color: "red",
        message: e instanceof Error ? e.message : "ذخیره ناموفق بود",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group gap="xs">
        <Button
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={open}
          disabled={disabled || !hasParts}
          variant="light"
          color="green"
          size="sm"
        >
          ذخیره سیستم
        </Button>
        <Button
          component={Link}
          href="/profile/systems"
          leftSection={<IconEye size={16} />}
          variant="subtle"
          size="sm"
        >
          سیستم‌های من
        </Button>
      </Group>

      <Modal opened={opened} onClose={close} title="ذخیره سیستم" centered>
        <Stack gap="md">
          <Text fz="sm" c="dimmed">
            این پیکربندی ذخیره می‌شود:{" "}
            <Text span fw={600} dir="ltr">
              {`?${searchParams.toString()}` || "خالی"}
            </Text>
          </Text>
          <TextInput
            label="نام سیستم"
            placeholder="مثلاً سیستم گیمینگ اقتصادی"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            maxLength={50}
            autoFocus
            data-autofocus
          />
          <Group justify="flex-end">
            <Button
              variant="subtle"
              color="gray"
              onClick={close}
              disabled={loading}
            >
              انصراف
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleSave}
              loading={loading}
            >
              ذخیره
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
