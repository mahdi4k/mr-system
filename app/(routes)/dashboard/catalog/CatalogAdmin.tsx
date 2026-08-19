"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Image,
  Loader,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconCloudDownload, IconSearch } from "@tabler/icons-react";
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
                loading={running === "images"}
                onClick={() =>
                  runAction("دریافت تصاویر", "/api/price-sync/import-images", {
                    limit: 100,
                  })
                }
              >
                دریافت تصاویر (۵ عدد)
              </Button>
            </Group>
            {result && <Text size="sm">{result}</Text>}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="match" pt="md">
          <Stack gap="sm">
            <Group align="end">
              <TextInput
                label="تعداد کاتالوگ / اسم کالا"
                value={suggestQuery}
                onChange={(e) => setSuggestQuery(e.currentTarget.value)}
                placeholder="e.g. Intel Core i5-12400F"
              />
              <Button
                variant="light"
                loading={running === "suggest"}
                onClick={() =>
                  runAction("پیشنهاد کاندیدا", "/api/match-candidates", {
                    partType,
                    productId: Number(suggestFor),
                    query: suggestQuery,
                  }).then(loadCandidates)
                }
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
            {loadingCatalog ? (
              <Loader />
            ) : (
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>#</Table.Th>
                    <Table.Th>نام</Table.Th>
                    <Table.Th>قیمت</Table.Th>
                    <Table.Th>مرجع تورب</Table.Th>
                    <Table.Th>وضعیت</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {products.map((p) => (
                    <Table.Tr key={p.id}>
                      <Table.Td>{p.id}</Table.Td>
                      <Table.Td>{p.title}</Table.Td>
                      <Table.Td>
                        {p.price != null
                          ? p.price.toLocaleString("fa-IR") + " ت"
                          : "-"}
                      </Table.Td>
                      <Table.Td>
                        {p.torobProductId ? (
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
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
      <Box />
    </Stack>
  );
}
