"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TextInput,
  Text,
  Button,
  Box,
  Title,
  Group,
  Container,
  Paper,
  Card,
  SimpleGrid,
  Select,
  Textarea,
  Modal,
  Flex,
  ActionIcon,
} from "@mantine/core";
import classes from "./ActionGrid.module.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { UseAdsCategory } from "@/_components/adsSection/UseAdsCategorySelect";
import ModalSubmit from "@/_components/adsSection/ModalSubmit";
import { useDisclosure } from "@mantine/hooks";
import { City, Province } from "./page";
import {
  convertNumberToWords,
  formatNumber,
  persianToWesternNumerals,
} from "@/_utils/utils";
import AdsImageForm from "@/_components/adsSection/AdsImageForm";
import { notifications } from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import { useRouter } from "next/navigation";
import LoginModal from "@/_components/loginModal/LoginModal";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function PageClient() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [showErrorOstan, setShowErrorOstan] = useState(false);
  const [showErrorCategory, setShowErrorCategory] = useState(false);
  const [priceInWords, setPriceInWords] = useState("");
  const [loading, setLoading] = useState(false);
  const { items, activeCategory } = UseAdsCategory();
  const [token, setToken] = useState<string | null>(null);
  const [openedLogin, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const authResponse = await fetch("/api/check-auth"); // Call your API to check the token
      const { token } = await authResponse.json();

      if (!token) {
        setIsModalOpen(true); // Open modal if no token
      } else {
        setToken(token.value); // Save the token
        setIsModalOpen(false); // Close modal
      }
    } catch (error) {
      router.push("/"); // Redirect on error
    }
  }, [router]);

  useEffect(() => {
    checkAuth(); // Call checkAuth on component mount
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    // Trigger re-checking the token after login
    checkAuth();
  };

  const form = useForm({
    initialValues: {
      title: "",
      category_id: "",
      city: null,
      ostan: "",
      price: "",
      description: "",
    },
    validate: {
      title: isNotEmpty("فیلد عنوان اجباری است"),
      description: isNotEmpty("فیلد توضیحات اجباری است"),
      city: isNotEmpty("فیلد شهر اجباری است"),
    },
  });

  const handleProvinceChange = (provinceId: string | null) => {
    form.setFieldValue("city", null);

    if (provinceId) {
      setSelectedProvince(parseInt(provinceId, 10));
      const citiesForProvince = cities.filter(
        (city) => city.province_id === parseInt(provinceId, 10),
      );
      setAvailableCities(citiesForProvince);
      form.setFieldValue("ostan", provinceId);
      setShowErrorOstan(false);
    }
  };
  useEffect(() => {
    // Fetch provinces and cities data from public folder
    const fetchProvincesAndCities = async () => {
      const provincesResponse = await fetch("/provinces.json");
      const citiesResponse = await fetch("/cities.json");

      const provincesData: Province[] = await provincesResponse.json();
      const citiesData: City[] = await citiesResponse.json();

      setProvinces(provincesData);
      setCities(citiesData);
    };

    fetchProvincesAndCities();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category_id", `${activeCategory}`);
    formData.append("city", values.city ? values.city : "");
    formData.append("ostan", selectedProvince ? `${selectedProvince}` : "");
    formData.append("price", values.price.replace(/,/g, ""));
    formData.append("description", values.description);
    images.forEach((file) => formData.append("image[]", file));

    try {
      setLoading(false);
      open();
      setImages([]);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const westernValue = persianToWesternNumerals(inputValue);
    const numericValue = parseInt(westernValue.replace(/,/g, ""), 10);

    const priceWords = convertNumberToWords(numericValue);
    setPriceInWords(priceWords);

    const formattedValue = formatNumber(westernValue);
    form.setFieldValue("price", formattedValue);
  };

  const validateOtherField = () => {
    selectedProvince === null
      ? setShowErrorOstan(true)
      : setShowErrorOstan(false);
    activeCategory === null
      ? setShowErrorCategory(true)
      : setShowErrorCategory(false);
  };

  const HandleModalLoginOpen = () => {
    if (token) {
      closeLogin();
    } else {
      openLogin();
    }
  };
  return (
    <Container w={{ base: "100%", lg: "700px" }} size={"xxl"}>
      <Paper
        mb={"xl"}
        px={{ base: "xs", lg: "xl" }}
        shadow="sm"
        pb={"lg"}
        mt="xl"
      >
        <Box mx={"auto"}>
          <Title
            style={{ fontFamily: "var(--font-vazirmatn)" }}
            onClick={open}
            order={2}
            mb="xl"
          >
            ثبت آگهی
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit, validateOtherField)}>
            <TextInput
              label="عنوان آگهی"
              withAsterisk
              {...form.getInputProps("title")}
              mb="md"
            />

            <AdsImageForm images={images} setImages={setImages} />

            <Card withBorder radius="md" className={classes.card}>
              <Group justify="space-between">
                <Text className={classes.title}>انتخاب دسته‌بندی</Text>
              </Group>
              <SimpleGrid
                cols={{ base: 3, lg: 4 }}
                verticalSpacing={"xl"}
                mt="md"
              >
                {items}
              </SimpleGrid>
              {showErrorCategory ? (
                <Text mt={"4px"} c={"red"} size="xs">
                  فیلد دسته‌بندی اجباری است
                </Text>
              ) : (
                ""
              )}
            </Card>

            <SimpleGrid mt={"xl"} cols={2}>
              <Box>
                <Select
                  label="استان"
                  withAsterisk
                  value={selectedProvince ? selectedProvince.toString() : null}
                  onChange={handleProvinceChange}
                  data={provinces.map((province) => ({
                    value: province.id.toString(),
                    label: province.name,
                  }))}
                />
                {showErrorOstan ? (
                  <Text mt={"4px"} c={"red"} size="xs">
                    فیلد استان اجباری است
                  </Text>
                ) : (
                  ""
                )}
              </Box>
              <Select
                label="شهر"
                withAsterisk
                data={availableCities.map((city) => ({
                  value: city.id.toString(),
                  label: city.name,
                }))}
                {...form.getInputProps("city")}
                disabled={!selectedProvince} // Disable city select if no province is selected
              />
            </SimpleGrid>

            <TextInput
              mt={"lg"}
              label="قیمت (تومان)"
              value={form.values.price}
              onChange={handlePriceChange}
            />
            {priceInWords && (
              <Text c="dimmed" mt={"3px"} mb="md" fz={"xs"}>
                {" "}
                {priceInWords} تومان{" "}
              </Text>
            )}

            <Textarea
              minRows={4}
              autosize
              mt={"lg"}
              withAsterisk
              {...form.getInputProps("description")}
              label={"توضیحات"}
            ></Textarea>
            <Group w={"100%"} justify="flex-end" mt={"lg"}>
              <Button
                loading={loading}
                size="md"
                w={"100%"}
                color="var(--mantine-color-kiwi-8)"
                px={"xl"}
                type="submit"
              >
                ثبت
              </Button>
            </Group>
          </form>
        </Box>
      </Paper>
      <ModalSubmit opened={opened} close={close} />

      <Modal
        styles={{ title: { width: "100%" } }}
        withCloseButton={false}
        opened={isModalOpen}
        onClose={HandleModalLoginOpen}
        title={
          <Flex w={"100%"} justify={"space-between"} align={"center"}>
            <Text>ورود / ثبت نام</Text>{" "}
            <ActionIcon variant="subtle" component={Link} href={"/"}>
              <IconArrowLeft />
            </ActionIcon>
          </Flex>
        }
      >
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          isAdsSection={true}
          setIsModalOpen={setIsModalOpen}
          close={HandleModalLoginOpen}
        />
      </Modal>
    </Container>
  );
}
