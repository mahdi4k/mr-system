import {
  Button,
  Text,
  Card,
  Group,
  SimpleGrid,
  Container,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCreditCard,
  IconBuildingBank,
  IconRepeat,
  IconReceiptRefund,
  IconReceipt,
  IconReceiptTax,
  IconDevicesPc,
  IconHeartRateMonitor,
  IconCpu,
  IconBrandNationalGeographic,
} from "@tabler/icons-react";
import React from "react";
import classes from "./cardService.module.css";

const CardService = () => {
  const cardDetails = [
    {
      id: 1,
      title: "انتخاب سیستم براساس بودجه",
      description:
        "با انتخاب یه بازه قیمتی و نوع کاربرد بهترین قطعات براتون پیشنهاد میدیم",
      link: "",
      icons: [
        {
          title: "Computer Case",
          icon: IconDevicesPc,
          color: "violet",
          size: "100%",
        },
      ],
    },
    {
      id: 2,
      title: "انتخاب سیستم به صورت کاستوم",
      description:
        "اگر دوست داشتین قطعات رو خودتون انتخاب کنید مشکلی نیست , با هوش مصنوعی ما فقط کافی هست یک قطعه رو انتخاب کنی تا بقیه قطعات پیشنهادی بهت نمایش داده بشه",
      icons: [
        {
          title: "Computer Case",
          icon: IconCreditCard,
          color: "violet",
          size: "2rem",
        },
        {
          title: "Motherboard",
          icon: IconBuildingBank,
          color: "indigo",
          size: "2rem",
        },
        { title: "CPU", icon: IconCpu, color: "blue", size: "2rem" },
        {
          title: "Graphics card ",
          icon: IconBrandNationalGeographic,
          color: "green",
          size: "2rem",
        },
        { title: "Power", icon: IconReceipt, color: "teal", size: "2rem" },
        {
          title: "Monitor",
          icon: IconHeartRateMonitor,
          color: "cyan",
          size: "2rem",
        },
      ],
      link: "",
    },
  ];
  return (
    <Container size="md">
      <SimpleGrid spacing={70} pb={"xl"} cols={{ base: 1, sm: 2 }}>
        {cardDetails.map((card) => (
          <Card
            className={classes.cardMain}
            key={card.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Group justify="center" mt="md" mb="xs">
              <Text fz={"xl"} fw={500}>
                {card.title}
              </Text>
            </Group>

            <Text size="sm" c="dimmed">
              {card.description}
            </Text>

            <SimpleGrid
              w={"70%"}
              className={classes.cardIcon}
              cols={card.icons.length / 2}
              mt="md"
            >
              {card.icons.map((item) => (
                <UnstyledButton key={item.title} className={classes.item}>
                  <item.icon color={item.color} size={item.size} />
                  <Text size="xs" mt={7}>
                    {item.title}
                  </Text>
                </UnstyledButton>
              ))}
            </SimpleGrid>

            <Button
              styles={{ label: { fontSize: "14px" } }}
              size="xl"
              variant="light"
              color="green"
              fullWidth
              radius="md"
            >
              انتخاب سیستم
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default CardService;
