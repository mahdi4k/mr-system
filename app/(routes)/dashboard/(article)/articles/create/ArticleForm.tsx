"use client";

import { createArticle } from "../../../../../_features/articles/client";
import type { ArticleStatus } from "../../../../../types/database.types";
import {
  Alert,
  Button,
  FileInput,
  Group,
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

export default function ArticleForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<ArticleFormValues>({
    initialValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryName: "",
      categorySlug: "",
      featuredImage: null as File | null,
      status: "draft" as ArticleStatus,
    },
    validate: {
      title: (value: string) =>
        value.trim().length >= 5 && value.trim().length <= 180
          ? null
          : "عنوان باید بین ۵ تا ۱۸۰ نویسه باشد.",
      slug: (value: string) =>
        slugPattern.test(value)
          ? null
          : "نامک فقط شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.",
      excerpt: (value: string) =>
        value.trim().length >= 20 && value.trim().length <= 500
          ? null
          : "خلاصه باید بین ۲۰ تا ۵۰۰ نویسه باشد.",
      content: (value: string) =>
        richTextLength(value) >= 50
          ? null
          : "متن مقاله باید حداقل ۵۰ نویسه باشد.",
      categoryName: (value: string) =>
        value.trim().length >= 2 ? null : "نام دسته‌بندی الزامی است.",
      categorySlug: (value: string) =>
        slugPattern.test(value) ? null : "نامک دسته‌بندی معتبر نیست.",
      featuredImage: (value: File | null) =>
        value && value.size > 5 * 1024 ** 2
          ? "حجم تصویر باید کمتر از ۵ مگابایت باشد."
          : null,
    },
  });

  const submit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await createArticle(values);
      notifications.show({
        color: "green",
        message:
          values.status === "published"
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
          مقاله جدید
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
              description="مثال: gaming-cpu-guide"
              label="نامک انگلیسی"
              withAsterisk
              {...form.getInputProps("slug")}
            />
            <Select
              data={[
                { label: "پیش‌نویس", value: "draft" },
                { label: "انتشار فوری", value: "published" },
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
          <Group justify="flex-end">
            <Button loading={loading} type="submit">
              {form.values.status === "published"
                ? "انتشار مقاله"
                : "ذخیره پیش‌نویس"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
