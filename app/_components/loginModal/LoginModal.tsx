"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextInput,
  Group,
  Button,
  useMantineColorScheme,
  Flex,
  PinInput,
  Text,
  Alert,
  ActionIcon,
} from "@mantine/core";
import Image from "next/image";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import classes from "@/_components/adsSection/ads.module.css";
import { useDispatch } from "react-redux";
import { setSuccessLogin } from "@/_redux/features/auth";
import { convertToEnglishNumber } from "@/_utils/utils";

export default function LoginModal({
  onLoginSuccess,
  close,
  isAdsSection,
  setIsModalOpen,
  style,
}: {
  style?: React.CSSProperties;
  onLoginSuccess?: () => void;
  close: () => void;
  isAdsSection?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [showErrorOtp, setShowErrorOtp] = useState<boolean>(false);
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const OTP_RESEND_TIME = 130;

  const [timeLeft, setTimeLeft] = useState(OTP_RESEND_TIME);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (otpSent && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      // Clear interval when the component unmounts or the timer reaches 0
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      setCanResend(true); // Enable resend button when timer reaches 0
    }
  }, [otpSent, timeLeft]);

  const handleResendOtp = () => {
    setCanResend(false); // Disable the resend button
    setTimeLeft(OTP_RESEND_TIME); // Reset the countdown timer

    // Call your OTP resend API here

    handlePhoneSubmit();
    // Reset the timer and start countdown
  };

  const form = useForm({
    initialValues: {
      code: "",
      phone: "",
    },
    validate: {
      code: (value: string) =>
        value ? (value.length !== 6 ? "code not complete" : null) : null,
      phone: (value: string) =>
        /^0?(9\d{9})$/.test(value)
          ? null
          : "شماره موبایل وارد شده معتبر نمی‌باشد",
    },
  });

  const handlePhoneSubmit = async () => {
    setOtpSent(true);
    try {
      const response = await fetch("/api/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: form.values.phone }),
      });

      if (response.ok) {
        notifications.show({
          message: "کد با موفقیت ارسال شد",
          classNames: classes,
        });
      } else {
        const data = await response.json();
        notifications.show({
          message: "خطایی پیش آمده لطفا دوباره تلاش کنید",
          color: "red",
          classNames: classes,
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      notifications.show({
        message: "خطایی پیش آمده لطفا دوباره تلاش کنید",
        color: "red",
        classNames: classes,
      });
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: form.values.phone,
          otp: form.values.code ? form.values.code : undefined,
        }),
      });

      if (response.ok) {
        if (onLoginSuccess) {
          onLoginSuccess(); // Call the callback if it exists
        }

        if (setIsModalOpen) {
          setIsModalOpen(false); // close modal
        }
        router.back(); // Navigate back to the root page

        setShowErrorOtp(false);
        notifications.show({
          message: "با موفقیت وارد شدید",
          classNames: classes,
        });
        dispatch(setSuccessLogin(true));
        close();
        setTimeout(async () => {
          const authResponse = await fetch("/api/check-auth");
          const { token } = await authResponse.json();

          if (token) {
            // const redirectPath = sessionStorage.getItem('redirectPath');
            // if (redirectPath) {
            //     router.push(redirectPath);
            //     sessionStorage.removeItem('redirectPath');
            // } else {
            //     router.push('/');
            // }
          } else {
            router.push("/"); // Redirect to home if no token
          }
        }, 1000);
      } else {
        setShowErrorOtp(true);
        const data = await response.json();
      }
    } catch (error) {
      setShowErrorOtp(true);
    }
  };

  const handleNumberChange = (value: string) => {
    // Convert Persian/Arabic digits to English digits
    let inputValue = convertToEnglishNumber(value);
    // Remove non-numeric characters (except commas for formatted values)
    inputValue = inputValue.replace(/\D/g, "");

    // Update the state
    form.setFieldValue("phone", inputValue);
  };

  return (
    <Box style={style} pos={"relative"} mb={"xs"} mx="auto">
      {!otpSent && (
        <Flex
          pos={"relative"}
          top={"-3px"}
          mb={"lg"}
          align={"center"}
          justify={"center"}
        >
          <Image
            style={{ objectFit: "contain" }}
            alt="kiwi part"
            src={colorScheme === "dark" ? "/logo-dark.png" : "/logo.png"}
            width={180}
            height={60}
          />
        </Flex>
      )}
      {isAdsSection ? (
        <Alert mb={"lg"} p={"xs"} color="green" variant="light">
          <Text fz={"xs"}>لطفاً برای ثبت آگهی ابتدا وارد سایت شوید</Text>
        </Alert>
      ) : (
        ""
      )}
      {!otpSent ? (
        <form onSubmit={form.onSubmit(handlePhoneSubmit)}>
          <TextInput
            mt={"xl"}
            size="md"
            data-autofocus
            label="لطفاً شماره موبایلتان را وارد کنید"
            placeholder=" شماره موبایل"
            value={form.values.phone}
            onChange={(event) => handleNumberChange(event.currentTarget.value)}
            required
            withAsterisk={false}
            mb="md"
          />
          <Group w={"100%"} align="center">
            <Button
              size="md"
              color="var(--mantine-color-kiwi-9)"
              w={"100%"}
              type="submit"
            >
              ارسال کد
            </Button>
          </Group>
        </form>
      ) : (
        <form onSubmit={form.onSubmit(handleOtpSubmit)}>
          <Text fz={"xl"}>کُد تایید را وارد کنید: </Text>
          <Text c="dimmed" mt={"xs"} fz={"sm"}>
            این کُد برای شماره {form.values.phone} پیامک شده است.
          </Text>
          <Button
            onClick={() => setOtpSent(false)}
            color="var(--mantine-color-kiwi-9)"
            size="xs"
            variant="transparent"
            pr={"0"}
            rightSection={<IconArrowLeft size={15} />}
          >
            تغییر شماره موبایل
          </Button>
          <PinInput
            {...form.getInputProps("code")}
            onComplete={handleOtpSubmit}
            dir={"ltr"}
            mt={"xl"}
            style={{ justifyContent: "center" }}
            size={"md"}
            placeholder={""}
            type={"number"}
            oneTimeCode
            autoFocus
            inputMode={"numeric"}
            name={"verify-code"}
            data-autofocus
            aria-autocomplete={"none"}
            length={6}
          />
          {showErrorOtp && (
            <Text fz={"sm"} c={"red"} mt={"lg"}>
              کد وارد شده اشتباه است یا منقضی شده است.
            </Text>
          )}
          <Flex mt={"md"} justify={"center"} align={"center"}>
            <Button
              size="xs"
              variant="transparent"
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend ? (
                "دریافت کد جدید"
              ) : (
                <Text fz={"xs"}> {timeLeft}s ثانیه مانده تا تلاش مجدد </Text>
              )}
            </Button>
          </Flex>
          <Group mt={"lg"} w={"100%"} align="center">
            <Button
              color="var(--mantine-color-kiwi-9)"
              w={"100%"}
              type="submit"
            >
              تایید
            </Button>
          </Group>
        </form>
      )}
    </Box>
  );
}
