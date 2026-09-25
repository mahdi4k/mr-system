"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDeviceDesktop, IconEdit, IconTrash } from "@tabler/icons-react";
import {
  cases,
  cpus,
  fans,
  graphics,
  motherboards,
  powers,
  rams,
  ssds,
} from "../../../_data/productCatalog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CardPartPrice from "../../../_components/shared/CardPartPrice";

interface SavedSystem {
  id: string;
  name: string;
  config: Record<string, string>;
  created_at: string;
  updated_at: string;
}

function configToQuery(config: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(config)) {
    if (v) params.set(k, v);
  }
  return params.toString();
}

type PartMeta = {
  key: string;
  label: string;
  icon: string;
  name: string;
  price: string | null;
};

function resolveParts(config: Record<string, string>): {
  parts: PartMeta[];
  total: number;
} {
  const ramQty = Math.max(1, Number(config.ramQuantity) || 1);
  const lookup: Record<
    string,
    {
      label: string;
      icon: string;
      list: { id: number; name: string; price?: string }[];
    }
  > = {
    cpu: { label: "پردازنده", icon: "/svg/cpu.svg", list: cpus },
    motherboard: {
      label: "مادربرد",
      icon: "/svg/motherboard.svg",
      list: motherboards,
    },
    ram: { label: "رم", icon: "/svg/ram.svg", list: rams },
    graphic: { label: "کارت گرافیک", icon: "/svg/graphic.svg", list: graphics },
    power: { label: "پاور", icon: "/svg/power.svg", list: powers },
    ssd: { label: "اس‌اس‌دی", icon: "/svg/ssd.svg", list: ssds },
    case: { label: "کیس", icon: "/svg/case.svg", list: cases },
    fan: { label: "فن", icon: "/svg/fan.svg", list: fans },
  };
  const order = [
    "cpu",
    "motherboard",
    "ram",
    "graphic",
    "power",
    "ssd",
    "case",
    "fan",
  ];
  const parts: PartMeta[] = [];
  let total = 0;

  for (const key of order) {
    const raw = config[key];
    if (!raw) continue;
    const meta = lookup[key];
    const found = meta.list.find((p) => String(p.id) === String(raw));
    const priceNum = found?.price ? Number(found.price) : 0;
    const qty = key === "ram" ? ramQty : 1;
    if (priceNum) total += priceNum * qty;
    parts.push({
      key,
      label: meta.label,
      icon: meta.icon,
      name: found ? `${qty > 1 ? `${qty}x ` : ""}${found.name}` : `#${raw}`,
      price: found?.price ? String(priceNum * qty) : null,
    });
  }
  return { parts, total };
}

export default function SavedSystemsClient() {
  const [systems, setSystems] = useState<SavedSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<SavedSystem | null>(null);
  const [editName, setEditName] = useState("");
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const loadSystems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved-systems");
      const body = (await res.json().catch(() => null)) as {
        data?: SavedSystem[];
        message?: string;
      } | null;
      if (!res.ok)
        throw new Error(body?.message || "دریافت سیستم‌ها ناموفق بود");
      setSystems(body?.data ?? []);
    } catch (e) {
      notifications.show({
        color: "red",
        message: e instanceof Error ? e.message : "خطا",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSystems();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/saved-systems/${id}`, { method: "DELETE" });
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (!res.ok) throw new Error(body?.message || "حذف ناموفق بود");
      setSystems((cur) => cur.filter((s) => s.id !== id));
      notifications.show({ color: "green", message: "سیستم حذف شد" });
    } catch (e) {
      notifications.show({
        color: "red",
        message: e instanceof Error ? e.message : "حذف ناموفق بود",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (sys: SavedSystem) => {
    setEditing(sys);
    setEditName(sys.name);
    openEdit();
  };

  const handleUpdateName = async () => {
    if (!editing) return;
    if (editName.trim().length < 2 || editName.trim().length > 50) {
      notifications.show({
        color: "red",
        message: "نام باید بین ۲ تا ۵۰ نویسه باشد",
      });
      return;
    }
    try {
      const res = await fetch(`/api/saved-systems/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (!res.ok) throw new Error(body?.message || "ویرایش ناموفق بود");
      setSystems((cur) =>
        cur.map((s) =>
          s.id === editing.id ? { ...s, name: editName.trim() } : s,
        ),
      );
      notifications.show({ color: "green", message: "نام ویرایش شد" });
      closeEdit();
    } catch (e) {
      notifications.show({
        color: "red",
        message: e instanceof Error ? e.message : "ویرایش ناموفق بود",
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" py="xl">
        <Loader color="green" />
      </Flex>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={3}>سیستم‌های من</Title>
          <Text c="dimmed" fz="sm" mt={4}>
            سیستم‌های ذخیره‌شده شما — با یک کلیک بارگذاری کنید
          </Text>
        </div>
        <Button
          component={Link}
          href="/choose-part"
          leftSection={<IconDeviceDesktop size={16} />}
          variant="light"
        >
          اسمبل جدید
        </Button>
      </Group>

      {systems.length === 0 ? (
        <Card withBorder radius="lg" p="xl">
          <Stack align="center" gap="sm">
            <IconDeviceDesktop size={42} stroke={1.2} />
            <Text fw={600}>هنوز سیستمی ذخیره نکرده‌اید</Text>
            <Text c="dimmed" fz="sm" ta="center">
              در صفحه{" "}
              <Text span fw={600}>
                انتخاب قطعات
              </Text>{" "}
              پیکربندی مورد نظر را بسازید و با دکمه{" "}
              <Text span fw={600} c="green">
                ذخیره سیستم
              </Text>{" "}
              آن را با نام دلخواه ذخیره کنید.
            </Text>
            <Button component={Link} href="/choose-part" mt="sm">
              رفتن به انتخاب قطعات
            </Button>
          </Stack>
        </Card>
      ) : (
        <SimpleGrid mb={'xl'} cols={{ base: 1, md: 2 }}>
          {systems.map((sys) => {
            const query = configToQuery(sys.config);
            const href = `/choose-part?${query}`;
            const { parts, total } = resolveParts(sys.config);
            return (
              <Card key={sys.id} withBorder radius="lg" padding="md">
                <Group justify="space-between" wrap="nowrap" align="flex-start">
                  <div style={{ minWidth: 0 }}>
                    <Text fw={700} lineClamp={1}>
                      {sys.name}
                    </Text>
                    <Text fz="xs" c="dimmed" mt={2}>
                      {new Intl.DateTimeFormat("fa-IR", {
                        dateStyle: "long",
                      }).format(new Date(sys.created_at))}
                    </Text>
                  </div>
                  <Group gap={4} wrap="nowrap">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleEdit(sys)}
                      aria-label="ویرایش نام"
                      size="sm"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      loading={deletingId === sys.id}
                      onClick={() => handleDelete(sys.id)}
                      aria-label="حذف"
                      size="sm"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Divider my="sm" />

                {parts.length > 0 ? (
                  <Stack gap="xs">
                    {parts.map((p) => (
                      <Group
                        key={p.key}
                        justify="space-between"
                        wrap="nowrap"
                        align="center"
                      >
                        <Group
                          gap="xs"
                          wrap="nowrap"
                          style={{ minWidth: 0, flex: 1 }}
                        >
                          <ThemeIcon variant="light" size="sm" radius="md">
                            <Image
                              src={p.icon}
                              alt={p.label}
                              width={16}
                              height={16}
                            />
                          </ThemeIcon>
                          <div style={{ minWidth: 0 }}>
                            <Text fz="xs" c="dimmed" lh={1.2}>
                              {p.label}
                            </Text>
                            <Text
                              fz="sm"
                              fw={500}
                              lineClamp={1}
                              dir="ltr"
                              ta="right"
                            >
                              {p.name}
                            </Text>
                          </div>
                        </Group>
                         
                      </Group>
                    ))}
                  </Stack>
                ) : (
                  <Text fz="sm" c="dimmed">
                    بدون قطعه
                  </Text>
                )}

                {total > 0 && (
                  <Group
                    justify="space-between"
                    mt="md"
                    pt="sm"
                    style={{
                      borderTop: "1px dashed var(--mantine-color-gray-3)",
                    }}
                  >
                    <Text fz="sm" fw={700}>
                      جمع کل
                    </Text>
                    <CardPartPrice price={String(total)} />
                  </Group>
                )}

                <Button
                  component={Link}
                  href={href}
                  fullWidth
                  mt="md"
                  variant="light"
                  size="xs"
                >
                  مشاهده در اسمبل
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>
      )}

      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="ویرایش نام سیستم"
        centered
      >
        <Stack>
          <TextInput
            label="نام جدید"
            value={editName}
            onChange={(e) => setEditName(e.currentTarget.value)}
            maxLength={50}
            autoFocus
          />
          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={closeEdit}>
              انصراف
            </Button>
            <Button onClick={handleUpdateName}>ذخیره</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
