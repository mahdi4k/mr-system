"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Flex,
  PinInput,
  SegmentedControl,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import { createClient } from "../../_lib/supabase/client";
import { convertToEnglishNumber } from "../../_utils/utils";
import classes from "@/_components/adsSection/ads.module.css";

interface LoginModalProps {
  close: () => void;
  isAdsSection?: boolean;
  onLoginSuccess?: () => void;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  style?: React.CSSProperties;
}

function toE164(phone: string): string {
  const localNumber = phone.startsWith("0") ? phone.slice(1) : phone;
  return `+98${localNumber}`;
}

export default function LoginModal({
  close,
  isAdsSection,
  onLoginSuccess,
  setIsModalOpen,
  style,
}: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const form = useForm({
    initialValues: { displayName: "", phone: "", code: "" },
    validate: {
      displayName: (value: string) =>
        mode === "register" &&
        (value.trim().length < 2 || value.trim().length > 80)
          ? "نام باید بین ۲ تا ۸۰ نویسه باشد"
          : null,
      phone: (value: string) =>
        /^0?9\d{9}$/.test(value) ? null : "شماره موبایل معتبر وارد کنید",
      code: (value: string) =>
        otpSent && !/^\d{6}$/.test(value) ? "کد تایید باید ۶ رقم باشد" : null,
    },
  });

  const sendOtp = async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    setLoading(true);
    try {
      const { error } = await createClient().auth.signInWithOtp({
        phone: toE164(form.values.phone),
        options: {
          shouldCreateUser: mode === "register",
          data:
            mode === "register"
              ? {
                  display_name: form.values.displayName.trim(),
                  phone: form.values.phone,
                }
              : undefined,
        },
      });
      if (error) throw error;
      setOtpSent(true);
      notifications.show({ color: "green", message: "کد تایید ارسال شد." });
    } catch {
      notifications.show({
        color: "red",
        message:
          mode === "login"
            ? "حسابی با این شماره یافت نشد یا ارسال کد ناموفق بود."
            : "ارسال کد ناموفق بود. شماره موبایل را بررسی کنید.",
        classNames: classes,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(form.values.code)) {
      form.setFieldError("code", "کد تایید باید ۶ رقم باشد");
      return;
    }

    setLoading(true);
    try {
      const { error } = await createClient().auth.verifyOtp({
        phone: toE164(form.values.phone),
        token: form.values.code,
        type: "sms",
      });
      if (error) throw error;

      notifications.show({ color: "green", message: "با موفقیت وارد شدید." });
      onLoginSuccess?.();
      setIsModalOpen?.(false);
      close();
      router.refresh();
      const next = new URLSearchParams(window.location.search).get("next");
      if (
        next?.startsWith("/") &&
        !next.startsWith("//") &&
        !next.includes("\\")
      ) {
        router.replace(next);
      } else if (window.location.pathname === "/login") {
        router.replace("/profile");
      }
    } catch {
      notifications.show({
        color: "red",
        message: "کد تایید اشتباه یا منقضی شده است.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    form.setFieldValue(
      "phone",
      convertToEnglishNumber(value).replace(/\D/g, ""),
    );
  };

  return (
    <Box style={style} pos="relative" mb="xs" mx="auto">
      <Flex mb="lg" align="center" justify="center">
        <Image
          style={{ objectFit: "contain" }}
          alt="ریگورا"
          src={colorScheme === "dark" ? "/logo-dark.png" : "/logo.png"}
          width={180}
          height={60}
        />
      </Flex>
      {isAdsSection && (
        <Alert mb="lg" p="xs" color="green" variant="light">
          <Text fz="xs">لطفاً برای ثبت آگهی ابتدا وارد سایت شوید</Text>
        </Alert>
      )}
      {!otpSent ? (
        <>
          <SegmentedControl
            fullWidth
            mb="lg"
            value={mode}
            onChange={(value) => setMode(value as "login" | "register")}
            data={[
              { label: "ورود", value: "login" },
              { label: "ثبت نام", value: "register" },
            ]}
          />
          <form onSubmit={form.onSubmit(sendOtp)}>
            {mode === "register" && (
              <TextInput
                mb="md"
                label="نام نمایشی"
                autoComplete="name"
                {...form.getInputProps("displayName")}
              />
            )}
            <TextInput
              mb="lg"
              label="شماره موبایل"
              inputMode="tel"
              autoComplete="tel"
              value={form.values.phone}
              onChange={(event) => handlePhoneChange(event.currentTarget.value)}
              error={form.errors.phone}
              placeholder="09123456789"
            />
            <Button
              loading={loading}
              disabled={loading}
              fullWidth
              type="submit"
            >
              ارسال کد تایید
            </Button>
          </form>
        </>
      ) : (
        <form onSubmit={form.onSubmit(verifyOtp)}>
          <Text fz="sm" mb="md">
            کد ارسال‌شده به {form.values.phone} را وارد کنید.
          </Text>
          <PinInput
            length={6}
            type="number"
            inputMode="numeric"
            oneTimeCode
            autoFocus
            dir="ltr"
            mx="auto"
            mb="xs"
            {...form.getInputProps("code")}
          />
          {form.errors.code && (
            <Text c="red" fz="xs" ta="center" mb="sm">
              {form.errors.code}
            </Text>
          )}
          <Button loading={loading} disabled={loading} fullWidth type="submit">
            تایید و ورود
          </Button>
          <Flex mt="sm" justify="space-between">
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setOtpSent(false)}
            >
              تغییر شماره
            </Button>
            <Button
              variant="subtle"
              size="xs"
              onClick={sendOtp}
              loading={loading}
            >
              ارسال دوباره کد
            </Button>
          </Flex>
        </form>
      )}
    </Box>
  );
}
