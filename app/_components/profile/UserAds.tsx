"use client";

import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../_features/ads/types";
import { deleteAd, getAds } from "../../_features/ads/data";
import { createClient } from "../../_lib/supabase/client";
import CardPartPrice from "../shared/CardPartPrice";
import ImgNoProduct from "../../../public/no-product.png";

export default function UserAds() {
  const [ads, setAds] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [opened, { open, close }] = useDisclosure(false);

  const loadAds = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      const result = await getAds({}, supabase, user.id);
      setAds(result.data);
    } catch {
      notifications.show({
        color: "red",
        message: "دریافت آگهی‌های شما ناموفق بود.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAds();
  }, []);

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    open();
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await deleteAd(selectedId);
      setAds((current) => current.filter((ad) => ad.id !== selectedId));
      notifications.show({ color: "green", message: "آگهی حذف شد." });
      close();
    } catch (error) {
      notifications.show({
        color: "red",
        message:
          error instanceof Error ? error.message : "حذف آگهی ناموفق بود.",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader color="green" />;

  return (
    <>
      <SimpleGrid mb="xl" cols={{ base: 1, xs: 2, sm: 3, xl: 2 }}>
        {ads.length ? (
          ads.map((item) => {
            const images = item.image
              ? (JSON.parse(item.image) as string[])
              : [];
            return (
              <Card key={item.id} withBorder>
                <Group wrap="nowrap">
                  <Image
                    alt={item.title}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                    src={images[0] || ImgNoProduct}
                  />
                  <Flex w="100%" direction="column">
                    <Text component={Link} href={`/ads/${item.id}`} fz="sm">
                      {item.title}
                    </Text>
                    <Flex mt="xl" justify="space-between" align="center">
                      <CardPartPrice isAds price={item.price} />
                      <Badge>
                        {item.status === "published"
                          ? "منتشر شده"
                          : "در حال بررسی"}
                      </Badge>
                    </Flex>
                  </Flex>
                </Group>
                <Group mt="md" justify="flex-end">
                  <Button
                    component={Link}
                    href={`/ads/${item.id}/edit`}
                    size="xs"
                    variant="light"
                  >
                    ویرایش
                  </Button>
                  <Button
                    onClick={() => confirmDelete(item.id)}
                    size="xs"
                    color="red"
                    variant="light"
                  >
                    حذف
                  </Button>
                </Group>
              </Card>
            );
          })
        ) : (
          <Card withBorder>
            <Text ta="center" fw="bold">
              آگهی یافت نشد
            </Text>
          </Card>
        )}
      </SimpleGrid>
      <Modal opened={opened} onClose={close} title="حذف آگهی">
        <Text>آیا از حذف این آگهی مطمئن هستید؟</Text>
        <Group mt="lg" justify="flex-end">
          <Button variant="default" onClick={close}>
            انصراف
          </Button>
          <Button color="red" loading={deleting} onClick={handleDelete}>
            حذف
          </Button>
        </Group>
      </Modal>
    </>
  );
}
