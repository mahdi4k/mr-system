"use client";

import {
  Button,
  Container,
  Paper,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "../../../../_features/ads/types";
import { updateAd } from "../../../../_features/ads/data";

export default function PageClient({ ad }: { ad: Product }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      title: ad.title,
      description: ad.description,
      price: ad.price,
    },
    validate: {
      title: (value: string) =>
        value.trim().length >= 3 && value.trim().length <= 120
          ? null
          : "عنوان باید بین ۳ تا ۱۲۰ نویسه باشد",
      description: (value: string) =>
        value.trim().length >= 10 && value.trim().length <= 5000
          ? null
          : "توضیحات باید بین ۱۰ تا ۵۰۰۰ نویسه باشد",
      price: (value: string) =>
        !value || (/^\d+$/.test(value) && Number(value) >= 0)
          ? null
          : "قیمت معتبر نیست",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await updateAd(ad.id, {
        title: values.title.trim(),
        description: values.description.trim(),
        price: values.price ? Number(values.price) : null,
      });
      notifications.show({ color: "green", message: "آگهی ویرایش شد." });
      router.replace(`/ads/${ad.id}`);
      router.refresh();
    } catch (error) {
      notifications.show({
        color: "red",
        message:
          error instanceof Error ? error.message : "ویرایش آگهی ناموفق بود.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" my="xl" style={{ flex: 1, width: "100%" }}>
      <Paper p="xl" withBorder>
        <Title order={2} mb="xl">
          ویرایش آگهی
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="عنوان" mb="md" {...form.getInputProps("title")} />
          <TextInput
            label="قیمت (تومان)"
            inputMode="numeric"
            mb="md"
            {...form.getInputProps("price")}
          />
          <Textarea
            label="توضیحات"
            autosize
            minRows={5}
            mb="lg"
            {...form.getInputProps("description")}
          />
          <Button type="submit" loading={loading} fullWidth>
            ذخیره تغییرات
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
