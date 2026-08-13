"use client";

import { createClient } from "../../../../_lib/supabase/client";
import type { ArticleStatus } from "../../../../types/database.types";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Menu,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArticle,
  IconDotsVertical,
  IconExternalLink,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import type { DashboardArticle } from "./page";

const statusMap: Record<ArticleStatus, { color: string; label: string }> = {
  draft: { color: "orange", label: "پیش‌نویس" },
  published: { color: "green", label: "منتشرشده" },
  archived: { color: "gray", label: "بایگانی" },
};

export default function ArticlesClient({
  initialArticles,
}: {
  initialArticles: DashboardArticle[];
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [deleteTarget, setDeleteTarget] = useState<DashboardArticle>();
  const [loadingId, setLoadingId] = useState<string>();

  const changeStatus = async (
    article: DashboardArticle,
    status: ArticleStatus,
  ) => {
    setLoadingId(article.id);
    const { error } = await createClient()
      .from("articles")
      .update({ status })
      .eq("id", article.id);
    setLoadingId(undefined);
    if (error) {
      notifications.show({ color: "red", message: "تغییر وضعیت ناموفق بود." });
      return;
    }
    setArticles((items) =>
      items.map((item) =>
        item.id === article.id ? { ...item, status } : item,
      ),
    );
    notifications.show({ color: "green", message: "وضعیت مقاله تغییر کرد." });
  };

  const removeArticle = async () => {
    if (!deleteTarget) return;
    setLoadingId(deleteTarget.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", deleteTarget.id);
    if (!error && deleteTarget.featured_image_path) {
      await supabase.storage
        .from("article-images")
        .remove([deleteTarget.featured_image_path]);
    }
    setLoadingId(undefined);
    if (error) {
      notifications.show({ color: "red", message: "حذف مقاله ناموفق بود." });
      return;
    }
    setArticles((items) => items.filter(({ id }) => id !== deleteTarget.id));
    setDeleteTarget(undefined);
    notifications.show({ color: "green", message: "مقاله حذف شد." });
  };

  return (
    <Stack gap="lg">
      <Group align="flex-end" justify="space-between">
        <div>
          <Text c="dimmed" fz="sm" fw={600}>
            محتوا
          </Text>
          <Title order={1} size="h2">
            مدیریت مقالات
          </Title>
          <Text c="dimmed" fz="sm" mt={4}>
            ایجاد و انتشار محتوای آموزشی ریگورا
          </Text>
        </div>
        <Button
          component={Link}
          href="/dashboard/articles/create"
          leftSection={<IconPlus size={18} />}
        >
          مقاله جدید
        </Button>
      </Group>

      {articles.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
          {articles.map((article) => (
            <Card key={article.id} padding="md" radius="lg" withBorder>
              {article.featured_image_url ? (
                <Card.Section>
                  <Image
                    alt={article.title}
                    h={170}
                    src={article.featured_image_url}
                  />
                </Card.Section>
              ) : (
                <Card.Section h={170} bg="gray.1">
                  <Group h="100%" justify="center">
                    <IconArticle size={38} />
                  </Group>
                </Card.Section>
              )}
              <Group justify="space-between" mt="md" wrap="nowrap">
                <Badge color={statusMap[article.status].color} variant="light">
                  {statusMap[article.status].label}
                </Badge>
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon
                      loading={loadingId === article.id}
                      variant="subtle"
                    >
                      <IconDotsVertical size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {article.status !== "published" && (
                      <Menu.Item
                        onClick={() => void changeStatus(article, "published")}
                      >
                        انتشار
                      </Menu.Item>
                    )}
                    {article.status !== "draft" && (
                      <Menu.Item
                        onClick={() => void changeStatus(article, "draft")}
                      >
                        تبدیل به پیش‌نویس
                      </Menu.Item>
                    )}
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={() => setDeleteTarget(article)}
                    >
                      حذف
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
              <Title order={2} size="h4" lineClamp={2} mt="sm">
                {article.title}
              </Title>
              <Text c="dimmed" fz="sm" lineClamp={2} mih={44} mt="xs">
                {article.excerpt}
              </Text>
              <Group justify="space-between" mt="md">
                <Text c="dimmed" fz="xs">
                  {article.category_name}
                </Text>
                {article.status === "published" && (
                  <Button
                    component={Link}
                    href={`/blog/${article.slug}`}
                    rightSection={<IconExternalLink size={14} />}
                    size="compact-xs"
                    variant="subtle"
                  >
                    مشاهده
                  </Button>
                )}
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Alert icon={<IconArticle size={20} />} title="هنوز مقاله‌ای ندارید">
          <Text fz="sm" mb="md">
            اولین مقاله آموزشی ریگورا را ایجاد کنید.
          </Text>
          <Button component={Link} href="/dashboard/articles/create" size="xs">
            ایجاد مقاله
          </Button>
        </Alert>
      )}

      <Modal
        centered
        opened={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(undefined)}
        title="حذف مقاله"
      >
        <Text fz="sm">
          مقاله «{deleteTarget?.title}» برای همیشه حذف می‌شود.
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
            loading={loadingId === deleteTarget?.id}
            onClick={() => void removeArticle()}
          >
            حذف
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
