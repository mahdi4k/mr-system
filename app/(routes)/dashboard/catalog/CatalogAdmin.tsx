"use client";

import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  FileInput,
  Group,
  Image,
  Loader,
  Modal,
  NumberInput,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCloudDownload,
  IconEdit,
  IconPlayerPlay,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import { CATALOG_PART_TYPES } from "../../../_features/productCatalog/types";

interface CatalogProduct {
  id: number;
  name: string;
  title: string;
  price: number | null;
  priceSource: "automatic" | "manual" | null;
  image: string;
  torobProductId: string | null;
  overlay: {
    syncStatus: "active" | "failed" | "retrying" | "never";
    fetchedAt: string | null;
    updatedAt: string | null;
  };
}

interface CandidateRow {
  id: string;
  part_type: string;
  product_id: number;
  candidate_name: string;
  candidate_price: number | null;
  candidate_image_url: string | null;
  search_query: string;
  status: string;
}

async function postJson(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return (await res.json().catch(() => ({}))) as Record<string, unknown>;
}

// Pacing for the direct-Torob batch loop — keep requests human-paced so the
// anti-bot layer is less likely to flag us.
const TOROB_DIRECT_BATCH_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CatalogAdmin() {
  const [tab, setTab] = useState<string | null>("sync");
  const [partType, setPartType] = useState<string>("cpu");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [suggestQuery, setSuggestQuery] = useState("");
  const [suggestFor, setSuggestFor] = useState<number>(1);

  // Edit modal state
  const [editProduct, setEditProduct] = useState<CatalogProduct | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Parse.bot sync state
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);

  // Torob direct sync state
  const [directSyncingId, setDirectSyncingId] = useState<number | null>(null);
  const [directBatchSyncing, setDirectBatchSyncing] = useState(false);
  const [directProgress, setDirectProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);

  const loadCatalog = async (pt: string) => {
    setLoadingCatalog(true);
    setError("");
    try {
      const res = await fetch(`/api/catalog/${pt}`, { cache: "no-store" });
      if (!res.ok) throw new Error("دریافت کاتالوگ ناموفق بود");
      const data = (await res.json()) as CatalogProduct[];
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingCatalog(false);
    }
  };

  const loadCandidates = async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch("/api/match-candidates?status=pending");
      const data = (await res.json().catch(() => [])) as CandidateRow[];
      setCandidates(data);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadCatalog(partType);
  }, [partType]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const runAction = async (name: string, url: string, body?: unknown) => {
    setRunning(name);
    setError("");
    setResult("");
    try {
      const data = await postJson(url, body);
      if (data.error) {
        setError(String(data.error));
      } else {
        setResult(`${name}: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(null);
    }
  };

  const review = async (id: string, status: "approved" | "rejected") => {
    await fetch("/api/match-candidates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: id, status }),
    });
    loadCandidates();
    loadCatalog(partType);
  };

  // Edit modal
  const openEditModal = (product: CatalogProduct) => {
    setEditProduct(product);
    setEditPrice(product.price ?? "");
    setEditImage(null);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
    setEditImage(null);
    setEditPrice("");
  };

  const saveEdit = async () => {
    if (!editProduct) return;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      if (editPrice !== "" && editPrice !== null) {
        formData.append("price", String(editPrice));
      }

      if (editImage) {
        formData.append("image", editImage);
      }

      if (Array.from(formData.entries()).length === 0) {
        closeEditModal();
        return;
      }

      const res = await fetch(`/api/catalog/${partType}/${editProduct.id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "بروزرسانی ناموفق بود");
      }

      closeEditModal();
      loadCatalog(partType);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const editImagePreview = editImage
    ? URL.createObjectURL(editImage)
    : (editProduct?.image ?? null);

  // Parse.bot sync (single)
  const syncFromParseBot = async (product: CatalogProduct) => {
    setSyncingId(product.id);
    setError("");
    try {
      const res = await fetch(`/api/catalog/${partType}/${product.id}/parse`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "خطا در همگام‌سازی از تورب");
      }
      loadCatalog(partType);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSyncingId(null);
    }
  };

  // Batch sequential sync
  const syncSelected = async () => {
    const ids = products.filter(
      (p) => selectedIds.has(p.id) && p.torobProductId,
    );
    if (ids.length === 0) return;

    setBatchSyncing(true);
    setSyncProgress({ done: 0, total: ids.length });
    setError("");

    for (const product of ids) {
      setSyncingId(product.id);
      try {
        const res = await fetch(
          `/api/catalog/${partType}/${product.id}/parse`,
          { method: "POST" },
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(`Sync failed for ${product.id}:`, data.error ?? "خطا");
        }
      } catch (e) {
        console.error(
          `Sync error for ${product.id}:`,
          e instanceof Error ? e.message : String(e),
        );
      } finally {
        setSyncingId(null);
        setSyncProgress((prev) =>
          prev ? { ...prev, done: prev.done + 1 } : null,
        );
      }
    }

    setBatchSyncing(false);
    setSyncProgress(null);
    setSelectedIds(new Set());
    loadCatalog(partType);
  };

  // Torob direct sync (single)
  const syncFromTorobDirect = async (product: CatalogProduct) => {
    setDirectSyncingId(product.id);
    setError("");
    try {
      const res = await fetch(`/api/catalog/${partType}/${product.id}/torob`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "خطا در دریافت مستقیم از تورب");
      }
      loadCatalog(partType);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setDirectSyncingId(null);
    }
  };

  // Batch sequential direct-Torob sync
  const syncSelectedDirect = async () => {
    const ids = products.filter(
      (p) => selectedIds.has(p.id) && p.torobProductId,
    );
    if (ids.length === 0) return;

    setDirectBatchSyncing(true);
    setDirectProgress({ done: 0, total: ids.length });
    setError("");

    for (let i = 0; i < ids.length; i++) {
      const product = ids[i];
      setDirectSyncingId(product.id);
      try {
        const res = await fetch(
          `/api/catalog/${partType}/${product.id}/torob`,
          { method: "POST" },
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(
            `Torob direct sync failed for ${product.id}:`,
            data.error ?? "خطا",
          );
        }
      } catch (e) {
        console.error(
          `Torob direct sync error for ${product.id}:`,
          e instanceof Error ? e.message : String(e),
        );
      } finally {
        setDirectSyncingId(null);
        setDirectProgress((prev) =>
          prev ? { ...prev, done: prev.done + 1 } : null,
        );
      }
      if (i < ids.length - 1) {
        await sleep(TOROB_DIRECT_BATCH_DELAY_MS);
      }
    }

    setDirectBatchSyncing(false);
    setDirectProgress(null);
    setSelectedIds(new Set());
    loadCatalog(partType);
  };

  const selectableCount = products.filter((p) => p.torobProductId).length;
  const allSelected =
    selectableCount > 0 &&
    products.every((p) => !p.torobProductId || selectedIds.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(
        new Set(products.filter((p) => p.torobProductId).map((p) => p.id)),
      );
    }
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <Stack gap="lg">
      <Title order={2}>مدیریت کاتالوگ و همگام‌سازی قیمت</Title>
      {error && (
        <Alert color="red" title="خطا">
          {error}
        </Alert>
      )}

      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="sync">همگام‌سازی</Tabs.Tab>
          <Tabs.Tab value="match">بازبینی تطبیق</Tabs.Tab>
          <Tabs.Tab value="catalog">کاتالوگ</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sync" pt="md">
          <Stack gap="sm">
            <Group>
              <Button
                leftSection={<IconCloudDownload size={18} />}
                loading={running === "backfill"}
                onClick={() =>
                  runAction("بک‌فیل مراجع", "/api/price-sync/backfill")
                }
              >
                بک‌فیل مراجع تورب از کاتالوگ ثابت
              </Button>
              <Button
                loading={running === "sync"}
                onClick={() =>
                  runAction("همگام‌سازی", "/api/price-sync", { limit: 20 })
                }
              >
                همگام‌سازی قیمت‌ها (۲۰ عدد)
              </Button>
              <Button
                variant="light"
                loading={running === "suggest"}
                onClick={() => {
                  setError("");
                  if (suggestQuery.trim())
                    runAction("پیشنهاد", "/api/match-candidates/suggest", {
                      part_type: "cpu",
                      product_id: suggestFor,
                      query: suggestQuery,
                    }).then(loadCandidates);
                }}
              >
                پیشنهاد کاندیداها
              </Button>
            </Group>
            {loadingMatches ? (
              <Loader />
            ) : candidates.length === 0 ? (
              <Text c="dimmed">کاندیدای در انتظار بازبینی وجود ندارد.</Text>
            ) : (
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>تصویر</Table.Th>
                    <Table.Th>نام</Table.Th>
                    <Table.Th>قیمت</Table.Th>
                    <Table.Th>کالای کاتالوگ</Table.Th>
                    <Table.Th>عملیات</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {candidates.map((c) => (
                    <Table.Tr key={c.id}>
                      <Table.Td>
                        {c.candidate_image_url ? (
                          <Image
                            src={c.candidate_image_url}
                            h={48}
                            w={48}
                            fit="contain"
                          />
                        ) : (
                          "-"
                        )}
                      </Table.Td>
                      <Table.Td>{c.candidate_name}</Table.Td>
                      <Table.Td>
                        {c.candidate_price != null
                          ? c.candidate_price.toLocaleString("fa-IR")
                          : "-"}
                      </Table.Td>
                      <Table.Td>
                        {c.part_type} #{c.product_id}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            onClick={() => review(c.id, "approved")}
                          >
                            تأیید
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            color="gray"
                            onClick={() => review(c.id, "rejected")}
                          >
                            رد
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="catalog" pt="md">
          <Stack gap="sm">
            <Group>
              {CATALOG_PART_TYPES.map((pt) => (
                <Button
                  key={pt}
                  size="xs"
                  variant={pt === partType ? "filled" : "light"}
                  onClick={() => setPartType(pt)}
                >
                  {pt}
                </Button>
              ))}
            </Group>

            {selectedIds.size > 0 && !batchSyncing && !directBatchSyncing && (
              <Group>
                <Button
                  leftSection={<IconPlayerPlay size={16} />}
                  onClick={syncSelected}
                >
                  همگام‌سازی انتخاب‌شده ({selectedIds.size})
                </Button>
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<IconSearch size={16} />}
                  onClick={syncSelectedDirect}
                >
                  دریافت مستقیم از تورب ({selectedIds.size})
                </Button>
              </Group>
            )}

            {batchSyncing && syncProgress && (
              <Text size="sm" c="dimmed">
                در حال همگام‌سازی: {syncProgress.done} از {syncProgress.total}
              </Text>
            )}

            {directBatchSyncing && directProgress && (
              <Text size="sm" c="dimmed">
                در حال دریافت مستقیم از تورب: {directProgress.done} از{" "}
                {directProgress.total}
              </Text>
            )}

            {loadingCatalog ? (
              <Loader />
            ) : (
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={40}>
                      <Checkbox
                        aria-label="انتخاب همه"
                        checked={allSelected}
                        indeterminate={selectedIds.size > 0 && !allSelected}
                        onChange={toggleAll}
                        disabled={
                          selectableCount === 0 ||
                          batchSyncing ||
                          directBatchSyncing
                        }
                      />
                    </Table.Th>
                    <Table.Th>#</Table.Th>
                    <Table.Th>نام</Table.Th>
                    <Table.Th>عملیات</Table.Th>
                    <Table.Th>قیمت</Table.Th>
                    <Table.Th>مرجع تورب</Table.Th>
                    <Table.Th>وضعیت</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {products.map((p) => {
                    const hasTorob = Boolean(p.torobProductId);
                    return (
                      <Table.Tr
                        key={p.id}
                        bg={
                          selectedIds.has(p.id)
                            ? "var(--mantine-color-blue-light)"
                            : undefined
                        }
                      >
                        <Table.Td>
                          <Checkbox
                            aria-label={`انتخاب ${p.title}`}
                            checked={selectedIds.has(p.id)}
                            onChange={() => toggleOne(p.id)}
                            disabled={
                              !hasTorob || batchSyncing || directBatchSyncing
                            }
                          />
                        </Table.Td>
                        <Table.Td>{p.id}</Table.Td>
                        <Table.Td>{p.title}</Table.Td>
                        <Table.Td>
                          <Group gap={4} wrap="nowrap">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => openEditModal(p)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            {hasTorob && (
                              <>
                                <Tooltip label="دریافت از تورب (Parse.bot)">
                                  <ActionIcon
                                    variant="light"
                                    color="green"
                                    loading={syncingId === p.id}
                                    disabled={directBatchSyncing}
                                    onClick={() => syncFromParseBot(p)}
                                  >
                                    <IconRefresh size={16} />
                                  </ActionIcon>
                                </Tooltip>
                                <Tooltip label="دریافت مستقیم از تورب">
                                  <ActionIcon
                                    variant="light"
                                    color="blue"
                                    loading={directSyncingId === p.id}
                                    disabled={batchSyncing}
                                    onClick={() => syncFromTorobDirect(p)}
                                  >
                                    <IconSearch size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              </>
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          {p.price != null
                            ? p.price.toLocaleString("fa-IR") + " ت"
                            : "-"}
                        </Table.Td>
                        <Table.Td>
                          {hasTorob ? (
                            <Badge size="xs">آماده</Badge>
                          ) : (
                            <Badge size="xs" color="gray">
                              ندارد
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            size="xs"
                            color={
                              p.overlay.syncStatus === "failed" ? "red" : "blue"
                            }
                          >
                            {p.overlay.syncStatus}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={editModalOpen}
        onClose={closeEditModal}
        title={`ویرایش ${editProduct?.title ?? ""}`}
        centered
      >
        <Stack gap="md">
          {editImagePreview && (
            <Image
              src={editImagePreview}
              h={160}
              w="auto"
              fit="contain"
              alt="تصویر محصول"
              style={{ alignSelf: "center" }}
            />
          )}

          <FileInput
            label="تصویر جدید"
            placeholder="انتخاب تصویر..."
            accept="image/*"
            clearable
            value={editImage}
            onChange={setEditImage}
          />

          <NumberInput
            label="قیمت (تومان)"
            placeholder="قیمت را وارد کنید"
            value={editPrice}
            onChange={(val) => setEditPrice(val === "" ? "" : Number(val))}
            thousandSeparator
            min={0}
            hideControls
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeEditModal}>
              انصراف
            </Button>
            <Button onClick={saveEdit} loading={saving}>
              ذخیره
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Box />
    </Stack>
  );
}
