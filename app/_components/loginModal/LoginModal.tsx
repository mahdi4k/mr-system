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

interface LoginFormValues {
  code: string;
  displayName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone: string;
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
  const phoneAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_PHONE_AUTH === "true";
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    initialValues: {
      displayName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      phone: "",
      code: "",
    },
    validate: {
      displayName: (value: string) =>
        mode === "register" &&
        (value.trim().length < 2 || value.trim().length > 80)
          ? "نام باید بین ۲ تا ۸۰ نویسه باشد"
          : null,
      phone: (value: string) =>
        authMethod === "phone" && !/^0?9\d{9}$/.test(value)
          ? "شماره موبایل معتبر وارد کنید"
          : null,
      code: (value: string) =>
        authMethod === "phone" && otpSent && !/^\d{6}$/.test(value)
          ? "کد تایید باید ۶ رقم باشد"
          : null,
      email: (value: string) =>
        authMethod === "email" && !/^\S+@\S+\.\S+$/.test(value.trim())
          ? "ایمیل معتبر وارد کنید"
          : null,
      password: (value: string) =>
        authMethod === "email" && value.length < 8
          ? "رمز عبور باید حداقل ۸ نویسه باشد"
          : null,
      passwordConfirmation: (value: string, values: LoginFormValues) =>
        authMethod === "email" &&
        mode === "register" &&
        value !== values.password
          ? "تکرار رمز عبور مطابقت ندارد"
          : null,
    },
  });

  const getNextPath = (): string => {
    const next = new URLSearchParams(window.location.search).get("next");
    return next?.startsWith("/") &&
      !next.startsWith("//") &&
      !next.includes("\\")
      ? next
      : "/profile";
  };

  const finishLogin = () => {
    onLoginSuccess?.();
    setIsModalOpen?.(false);
    close();
    router.refresh();
    const destination = new URL(getNextPath(), window.location.origin);
    destination.searchParams.set("login", "success");
    router.replace(`${destination.pathname}${destination.search}`);
  };

  const handleEmailAuth = async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    setLoading(true);
    setConfirmationSent(false);
    try {
      const supabase = createClient();
      if (mode === "register") {
        const callbackUrl = new URL("/auth/confirm", window.location.origin);
        callbackUrl.searchParams.set("next", getNextPath());
        const { data, error } = await supabase.auth.signUp({
          email: form.values.email.trim(),
          password: form.values.password,
          options: {
            emailRedirectTo: callbackUrl.toString(),
            data: { display_name: form.values.displayName.trim() },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setConfirmationSent(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.values.email.trim(),
          password: form.values.password,
        });
        if (error) throw error;
      }
      finishLogin();
    } catch {
      notifications.show({
        color: "red",
        message:
          mode === "register"
            ? "ثبت نام ناموفق بود. ممکن است این ایمیل قبلاً ثبت شده باشد."
            : "ایمیل یا رمز عبور صحیح نیست.",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const callbackUrl = new URL("/auth/confirm", window.location.origin);
      callbackUrl.searchParams.set("next", getNextPath());
      const { error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl.toString() },
      });
      if (error) throw error;
    } catch {
      setLoading(false);
      notifications.show({
        color: "red",
        message: "ورود با گوگل ناموفق بود.",
      });
    }
  };

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

      finishLogin();
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
          src="/logo-dark.png"
          width={180}
          height={60}
        />
      </Flex>
      {isAdsSection && (
        <Alert mb="lg" p="xs" color="green" variant="light">
          <Text fz="xs">لطفاً برای ثبت آگهی ابتدا وارد سایت شوید</Text>
        </Alert>
      )}
      {phoneAuthEnabled && (
        <SegmentedControl
          fullWidth
          mb="md"
          value={authMethod}
          onChange={(value) => {
            setAuthMethod(value as "email" | "phone");
            setOtpSent(false);
            setConfirmationSent(false);
            form.clearErrors();
          }}
          data={[
            { label: "ایمیل", value: "email" },
            { label: "شماره موبایل", value: "phone" },
          ]}
        />
      )}
      {authMethod === "email" ? (
        <>
          <SegmentedControl
            fullWidth
            mb="lg"
            value={mode}
            onChange={(value) => {
              setMode(value as "login" | "register");
              setConfirmationSent(false);
              form.clearErrors();
            }}
            data={[
              { label: "ورود", value: "login" },
              { label: "ثبت نام", value: "register" },
            ]}
          />
          {confirmationSent ? (
            <Alert mb="md" color="green" variant="light">
              لینک تایید به ایمیل شما ارسال شد. پس از تایید ایمیل می‌توانید وارد
              شوید.
            </Alert>
          ) : (
            <form onSubmit={form.onSubmit(handleEmailAuth)}>
              {mode === "register" && (
                <TextInput
                  mb="md"
                  label="نام نمایشی"
                  autoComplete="name"
                  {...form.getInputProps("displayName")}
                />
              )}
              <TextInput
                mb="md"
                label="ایمیل"
                type="email"
                autoComplete="email"
                {...form.getInputProps("email")}
              />
              <TextInput
                mb="md"
                label="رمز عبور"
                type="password"
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                {...form.getInputProps("password")}
              />
              {mode === "register" && (
                <TextInput
                  mb="lg"
                  label="تکرار رمز عبور"
                  type="password"
                  autoComplete="new-password"
                  {...form.getInputProps("passwordConfirmation")}
                />
              )}
              <Button
                loading={loading}
                disabled={loading}
                fullWidth
                type="submit"
              >
                {mode === "register" ? "ثبت نام" : "ورود"}
              </Button>
            </form>
          )}
          <Flex align="center" gap="sm" my="md">
            <Box h={1} bg="gray.3" style={{ flex: 1 }} />
            <Text c="dimmed" fz="xs">
              یا
            </Text>
            <Box h={1} bg="gray.3" style={{ flex: 1 }} />
          </Flex>
          <Button
            variant="default"
            loading={loading}
            disabled={loading}
            fullWidth
            onClick={signInWithGoogle}
          >
            ورود با گوگل
          </Button>
        </>
      ) : !otpSent ? (
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
