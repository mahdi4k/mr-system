import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { convertToEnglishNumber } from "../../../_utils/utils";

interface PhoneEditProps {
  close: () => void;
  currentPhone: string;
  fetchUserData?: () => Promise<void>;
  opened: boolean;
}

export default function PhoneEdit({
  close,
  currentPhone,
  fetchUserData,
  opened,
}: PhoneEditProps) {
  const form = useForm({
    initialValues: { phone: "" },
    validate: {
      phone: (value: string) =>
        value && !/^0?9\d{9}$/.test(value)
          ? "شماره موبایل معتبر وارد کنید"
          : null,
    },
  });

  useEffect(() => {
    if (opened) {
      form.setFieldValue("phone", currentPhone);
      form.clearErrors();
    }
  }, [currentPhone, opened]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const response = await fetch("/api/profile-edit", {
        method: "PATCH",
        body: JSON.stringify({ phone: values.phone }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Phone update failed");
      }
      await fetchUserData?.();
      notifications.show({
        color: "green",
        message: "شماره موبایل با موفقیت ویرایش شد.",
      });
      close();
    } catch {
      notifications.show({
        color: "red",
        message: "ویرایش شماره موبایل ناموفق بود.",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="ویرایش شماره موبایل">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="شماره موبایل تماس"
          description="این شماره در آگهی‌های شما نمایش داده می‌شود. خالی گذاشتن آن مجاز است."
          inputMode="tel"
          autoComplete="tel"
          placeholder="09123456789"
          value={form.values.phone}
          onChange={(event) =>
            form.setFieldValue(
              "phone",
              convertToEnglishNumber(event.currentTarget.value).replace(
                /\D/g,
                "",
              ),
            )
          }
          error={form.errors.phone}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">ذخیره</Button>
        </Group>
      </form>
    </Modal>
  );
}
