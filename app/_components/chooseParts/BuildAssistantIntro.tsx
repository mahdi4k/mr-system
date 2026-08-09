import { Badge, Container, Group, Paper, Text } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import classes from "./buildAssistant.module.css";

const BuildAssistantIntro = () => {
  return (
    <Container styles={{ root: { flex: "1 0 auto" } }} size={"lg"}>
      <section
        aria-labelledby="build-assistant-intro-title"
        className={classes.introSection}
      >
        <Paper className={classes.intro} radius="xl" shadow="md" withBorder>
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <div className={classes.assistantMark}>
                <IconSparkles size={22} />
              </div>
              <div>
                <Text fw={800} id="build-assistant-intro-title" size="lg">
                  ریگورا
                </Text>
                <Text c="dimmed" size="sm">
                  سریع‌تر به یک ترکیب کامل و مطمئن برسید
                </Text>
              </div>
            </Group>
            <Badge className={classes.statusBadge} color="lime" variant="light">
              آماده پیشنهاد
            </Badge>
          </Group>

          <Text className={classes.introText} size="sm">
            قطعات هوشمندانه انتخاب کن، خرید و فروش کن و از تازه‌ترین
            اخبار سخت‌افزار باخبر باش.{" "}
          </Text>

          <div className={classes.benefits}>
            <Text className={classes.benefit} size="xs">
              <span>۱</span> پیشنهاد قطعات براساس بودجه و نیاز
            </Text>
            <Text className={classes.benefit} size="xs">
              <span>۲</span> بررسی سازگاری و مقایسه قیمت قطعات
            </Text>
            <Text className={classes.benefit} size="xs">
              <span>۳</span> خرید، فروش و ثبت آگهی قطعات
            </Text>
          </div>
        </Paper>
      </section>
    </Container>
  );
};

export default BuildAssistantIntro;
