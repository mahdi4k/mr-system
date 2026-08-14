"use client";

import {
  createArticle,
  updateArticle,
} from "../../../../../_features/articles/client";
import type { ArticleEditRecord } from "../../../../../_features/articles/types";
import type { ArticleStatus } from "../../../../../types/database.types";
import {
  Alert,
  Button,
  Checkbox,
  FileInput,
  Group,
  Image,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconInfoCircle, IconPhoto } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArticleEditor from "./ArticleEditor";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function richTextLength(value: string): number {
  const element = document.createElement("div");
  element.innerHTML = value;
  return (element.textContent ?? "").trim().length;
}

interface ArticleFormValues {
  categoryName: string;
  categorySlug: string;
  content: string;
  excerpt: string;
  featuredImage: File | null;
  slug: string;
  status: ArticleStatus;
  title: string;
}

interface ArticleFormProps {
  article?: ArticleEditRecord;
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const [loading, setLoading] = useState(false);
  const [removeFeaturedImage, setRemoveFeaturedImage] = useState(false);
  const router = useRouter();
  const form = useForm<ArticleFormValues>({
    initialValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      excerpt: article?.excerpt ?? "",
      content: article?.content ?? "",
      categoryName: article?.categoryName ?? "",
      categorySlug: article?.categorySlug ?? "",
      featuredImage: null as File | null,
      status: article?.status ?? ("draft" as ArticleStatus),
    },
    validate: {
      title: (value: string) =>
        value.trim().length >= 5 && value.trim().length <= 180
          ? null
          : "عنوان باید بین ۵ تا ۱۸۰ نویسه باشد.",
      slug: (value: string) =>
        value.length >= 3 && value.length <= 180 && slugPattern.test(value)
          ? null
          : "نامک فقط شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.",
      excerpt: (value: string) =>
        value.trim().length >= 20 && value.trim().length <= 500
          ? null
          : "خلاصه باید بین ۲۰ تا ۵۰۰ نویسه باشد.",
      content: (value: string) =>
        richTextLength(value) >= 50 && value.trim().length <= 50000
          ? null
          : "متن مقاله باید حداقل ۵۰ نویسه و حداکثر ۵۰٬۰۰۰ نویسه باشد.",
      categoryName: (value: string) =>
        value.trim().length >= 2 && value.trim().length <= 80
          ? null
          : "نام دسته‌بندی باید بین ۲ تا ۸۰ نویسه باشد.",
      categorySlug: (value: string) =>
        value.length >= 2 && value.length <= 80 && slugPattern.test(value)
          ? null
          : "نامک دسته‌بندی معتبر نیست.",
      featuredImage: (value: File | null) =>
        value && value.size > 5 * 1024 ** 2
          ? "حجم تصویر باید کمتر از ۵ مگابایت باشد."
          : null,
    },
  });

  const submit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const result = article
        ? await updateArticle(article.id, {
            ...values,
            currentFeaturedImagePath: article.featuredImagePath,
            removeFeaturedImage,
          })
        : null;
      if (!article) await createArticle(values);
      notifications.show({
        color: result?.imageCleanupFailed ? "orange" : "green",
        message: result?.imageCleanupFailed
          ? "مقاله ذخیره شد، اما پاک‌سازی تصویر قبلی ناموفق بود."
          : article
            ? "تغییرات مقاله ذخیره شد."
            : values.status === "published"
              ? "مقاله منتشر شد."
              : "پیش‌نویس ذخیره شد.",
      });
      router.push("/dashboard/articles");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("duplicate")
          ? "این نامک قبلاً استفاده شده است."
          : "ذخیره مقاله ناموفق بود.";
      notifications.show({ color: "red", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack maw={900} mx="auto">
      <Group>
        <Button
          component={Link}
          href="/dashboard/articles"
          leftSection={<IconArrowRight size={17} />}
          variant="subtle"
        >
          بازگشت
        </Button>
      </Group>
      <div>
        <Text c="dimmed" fz="sm" fw={600}>
          محتوا
        </Text>
        <Title order={1} size="h2">
          {article ? "ویرایش مقاله" : "مقاله جدید"}
        </Title>
      </div>
      <Alert color="blue" icon={<IconInfoCircle size={20} />}>
        متن مقاله با قالب‌بندی امن ذخیره می‌شود. برای ساختار بهتر از عنوان‌ها،
        فهرست‌ها و پیوندها استفاده کنید.
      </Alert>
      <Paper
        component="form"
        onSubmit={form.onSubmit(submit)}
        p={{ base: "md", sm: "xl" }}
        radius="lg"
        withBorder
      >
        <Stack>
          <TextInput
            label="عنوان"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              description={
                article
                  ? "تغییر نامک، نشانی عمومی قبلی مقاله را از دسترس خارج می‌کند."
                  : "مثال: gaming-cpu-guide"
              }
              label="نامک انگلیسی"
              withAsterisk
              {...form.getInputProps("slug")}
            />
            <Select
              data={[
                { label: "پیش‌نویس", value: "draft" },
                { label: "انتشار فوری", value: "published" },
                { label: "بایگانی", value: "archived" },
              ]}
              label="وضعیت"
              {...form.getInputProps("status")}
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="نام دسته‌بندی"
              withAsterisk
              {...form.getInputProps("categoryName")}
            />
            <TextInput
              description="مثال: buying-guide"
              label="نامک دسته‌بندی"
              withAsterisk
              {...form.getInputProps("categorySlug")}
            />
          </SimpleGrid>
          <Textarea
            autosize
            label="خلاصه"
            maxRows={5}
            minRows={3}
            withAsterisk
            {...form.getInputProps("excerpt")}
          />
          <div>
            <Text component="label" fz="sm" fw={500} mb={4}>
              متن مقاله{" "}
              <Text component="span" c="red">
                *
              </Text>
            </Text>
            <ArticleEditor
              error={form.errors.content}
              onBlur={() => form.validateField("content")}
              onChange={(value) => form.setFieldValue("content", value)}
              value={form.values.content}
            />
          </div>
          <FileInput
            accept="image/jpeg,image/png,image/webp"
            clearable
            label="تصویر شاخص"
            leftSection={<IconPhoto size={17} />}
            placeholder="انتخاب تصویر تا ۵ مگابایت"
            {...form.getInputProps("featuredImage")}
          />
          {article?.featuredImageUrl && !removeFeaturedImage && (
            <Image
              alt={article.title}
              fit="cover"
              h={220}
              radius="md"
              src={article.featuredImageUrl}
              w="100%"
            />
          )}
          {article?.featuredImageUrl && (
            <Checkbox
              checked={removeFeaturedImage}
              disabled={Boolean(form.values.featuredImage)}
              label="حذف تصویر شاخص فعلی"
              onChange={(event) =>
                setRemoveFeaturedImage(event.currentTarget.checked)
              }
            />
          )}
          <Group justify="flex-end">
            <Button loading={loading} type="submit">
              {article
                ? "ذخیره تغییرات"
                : form.values.status === "published"
                  ? "انتشار مقاله"
                  : "ذخیره مقاله"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
