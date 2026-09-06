"use client";

import {
  useLazyGetCasesQuery,
  useLazyGetCpusQuery,
  useLazyGetFansQuery,
  useLazyGetGraphicsQuery,
  useLazyGetMotherboardsQuery,
  useLazyGetPowersQuery,
  useLazyGetRamsQuery,
  useLazyGetSsdsQuery,
} from "@/_redux/services";
import {
  BUILD_PART_TYPES,
  BuildCatalog,
  BuildIntent,
  BuildPartType,
  BuildRecommendation,
  findBuildRecommendation,
  parseBudgetFromMessage,
  parseBuildIntent,
} from "@/_utils/pcAssistant";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Paper,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSend, IconSparkles, IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import classes from "./buildAssistant.module.css";

interface ChatMessage {
  id: number;
  role: "assistant" | "user";
  text: string;
  recommendation?: BuildRecommendation;
}

const partLabels: Record<BuildPartType, string> = {
  cpu: "پردازنده",
  motherboard: "مادربرد",
  ram: "رم",
  graphic: "کارت گرافیک",
  power: "پاور",
  ssd: "حافظه SSD",
  case: "کیس",
  fan: "خنک‌کننده",
};

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("fa-IR").format(price);

const quickPrompts = [
  "یک سیستم تا قیمت ۶۰ میلیون تومان می‌خوام",
  "یک سیستم گیمینگ تا ۸۰ میلیون با کارت گرافیک انویدیا",
  "ارزان‌ترین سیستم کامل و سازگار را پیدا کن",
  "یه سیستم با رم ۱۶ گیگ و پردازنده اینتل بساز",
];

const BuildAssistant = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [getCases] = useLazyGetCasesQuery();
  const [getCpus] = useLazyGetCpusQuery();
  const [getFans] = useLazyGetFansQuery();
  const [getGraphics] = useLazyGetGraphicsQuery();
  const [getMotherboards] = useLazyGetMotherboardsQuery();
  const [getPowers] = useLazyGetPowersQuery();
  const [getRams] = useLazyGetRamsQuery();
  const [getSsds] = useLazyGetSsdsQuery();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const pendingIntent = useRef<BuildIntent | null>(null);
  const messagesViewport = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "سلام! بگو چه سیستمی می‌خواهی — مثلا «یک سیستم گیمینگ تا ۶۰ میلیون با رم ۱۶ گیگ» یا «ارزان‌ترین سیستم ممکن» — تا کامل و سازگار از قطعات موجود برات بسازم.",
    },
  ]);

  useEffect(() => {
    const viewport = messagesViewport.current;
    viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [isThinking, messages]);

  const addMessage = (message: Omit<ChatMessage, "id">): void => {
    setMessages((current) => [
      ...current,
      { ...message, id: Date.now() + current.length },
    ]);
  };

  const loadCatalog = async (): Promise<BuildCatalog> => {
    const [
      caseItems,
      cpuItems,
      fanItems,
      graphicItems,
      motherboardItems,
      powerItems,
      ramItems,
      ssdItems,
    ] = await Promise.all([
      getCases({}, true).unwrap(),
      getCpus({}, true).unwrap(),
      getFans({}, true).unwrap(),
      getGraphics({}, true).unwrap(),
      getMotherboards({}, true).unwrap(),
      getPowers({}, true).unwrap(),
      getRams({}, true).unwrap(),
      getSsds({}, true).unwrap(),
    ]);

    return {
      case: caseItems,
      cpu: cpuItems,
      fan: fanItems,
      graphic: graphicItems,
      motherboard: motherboardItems,
      power: powerItems,
      ram: ramItems,
      ssd: ssdItems,
    };
  };

  const submitMessage = async (message: string): Promise<void> => {
    if (!message || isThinking) return;

    setInput("");
    addMessage({ role: "user", text: message });

    let intent = parseBuildIntent(message);

    // Follow-up: the assistant previously asked for a budget.
    if (!intent && pendingIntent.current) {
      const budget = parseBudgetFromMessage(message);
      if (budget) {
        intent = { ...pendingIntent.current, maxBudget: budget };
      } else {
        const prefIntent = parseBuildIntent(`${message} سیستم`);
        if (prefIntent) {
          intent = {
            ...pendingIntent.current,
            ...prefIntent,
            maxBudget: prefIntent.maxBudget,
          };
        }
      }
    }
    pendingIntent.current = null;

    if (!intent) {
      addMessage({
        role: "assistant",
        text: "می‌تونم یک سیستم کامل و سازگار از قطعات موجود برات بسازم. مثلا بگو: «یک سیستم گیمینگ تا ۸۰ میلیون با رم ۱۶ گیگ» یا «ارزان‌ترین سیستم ممکن».",
      });
      return;
    }

    // A value-focused request needs a budget to maximize within.
    if (intent.objective === "best_value" && intent.maxBudget == null) {
      pendingIntent.current = intent;
      addMessage({
        role: "assistant",
        text: "چه بودجه‌ای داری؟ مثلا بگو «۶۰ میلیون» تا قوی‌ترین سیستمی که در بودجه‌ات جا می‌شود را پیدا کنم.",
      });
      return;
    }

    setIsThinking(true);

    try {
      const catalog = await loadCatalog();
      const recommendation = findBuildRecommendation(catalog, intent);

      if (!recommendation) {
        const missingPrices = BUILD_PART_TYPES.filter(
          (partType) =>
            !catalog[partType].some((product) => {
              const price = Number(product.price);
              return Number.isFinite(price) && price > 0;
            }),
        );
        if (missingPrices.length > 0) {
          addMessage({
            role: "assistant",
            text: `قیمت برخی قطعات (${missingPrices
              .map((partType) => partLabels[partType])
              .join("، ")}) دریافت نشد. لطفا دوباره تلاش کنید.`,
          });
          return;
        }
        addMessage({
          role: "assistant",
          text: intent.maxBudget
            ? `سیستم کامل و سازگاری با این شرایط زیر ${formatPrice(intent.maxBudget)} تومان پیدا نشد. بودجه را بیشتر کن یا شرایط (برند، رم و…) را آزادتر کن.`
            : "ترکیب کامل و سازگاری از قطعات موجود پیدا نشد. کمی بعد دوباره تلاش کنید.",
        });
        return;
      }

      addMessage({
        role: "assistant",
        text:
          intent.objective === "maximum_price"
            ? "گران‌ترین ترکیب کامل و سازگار از قطعات موجود را پیدا کردم. قبل از اعمال، قطعات را بررسی کن."
            : intent.objective === "best_value"
              ? "قوی‌ترین ترکیب کامل و سازگاری که در بودجه‌ات جا می‌شود را پیدا کردم. قبل از اعمال، قطعات را بررسی کن."
              : "ارزان‌ترین ترکیب کامل و سازگار موجود را پیدا کردم. قبل از اعمال، قطعات را بررسی کن.",
        recommendation,
      });
    } catch {
      addMessage({
        role: "assistant",
        text: "دریافت قیمت قطعات با مشکل روبه‌رو شد. لطفا کمی بعد دوباره تلاش کنید.",
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void submitMessage(input.trim());
  };

  const applyBuild = (recommendation: BuildRecommendation): void => {
    const params = new URLSearchParams(searchParams.toString());
    BUILD_PART_TYPES.forEach((partType) => {
      params.set(partType, String(recommendation.selection[partType]));
    });
    router.push(`/choose-part?${params.toString()}`);
    setIsOpen(false);
    addMessage({
      role: "assistant",
      text: "سیستم پیشنهادی اعمال شد. می‌توانید قطعات انتخاب‌شده را در صفحه بررسی کنید.",
    });
  };

  return (
    <Popover
      closeOnClickOutside
      offset={12}
      onChange={setIsOpen}
      position="top-end"
      shadow="xl"
      withinPortal
      opened={isOpen}
    >
      <Popover.Target>
        <Button
          className={`${classes.floatingButton} ${isOpen ? classes.open : ""}`}
          color="lime"
          leftSection={<IconSparkles size={20} />}
          onClick={() => setIsOpen((current) => !current)}
          radius="xl"
          size="md"
        >
          دستیار هوشمند
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        aria-label="گفتگو با دستیار هوشمند انتخاب قطعات"
        className={classes.popoverDropdown}
        role="dialog"
      >
        <Group className={classes.chatHeader} justify="space-between">
          <Group gap="xs">
            <IconSparkles color="var(--mantine-color-lime-6)" size={20} />
            <Text fw={700}>دستیار هوشمند انتخاب قطعات</Text>
          </Group>
          <ActionIcon
            aria-label="بستن دستیار"
            color="gray"
            onClick={() => setIsOpen(false)}
            variant="subtle"
          >
            <IconX size={18} />
          </ActionIcon>
        </Group>
        <div className={classes.chat}>
          <ScrollArea
            className={classes.messages}
            type="auto"
            viewportRef={messagesViewport}
          >
            <Stack gap="sm" p="md">
              {messages.map((message) => (
                <div
                  className={`${classes.message} ${
                    message.role === "user"
                      ? classes.userMessage
                      : classes.assistantMessage
                  }`}
                  key={message.id}
                >
                  <Text size="sm">{message.text}</Text>
                  {message.recommendation && (
                    <Paper className={classes.buildPreview} mt="sm" p="sm">
                      <Group justify="space-between" mb="xs">
                        <Badge color="lime" variant="light">
                          سیستم کامل
                        </Badge>
                        <Text fw={700} size="sm">
                          {formatPrice(message.recommendation.totalPrice)} تومان
                        </Text>
                      </Group>
                      <Stack gap={5}>
                        {BUILD_PART_TYPES.map((partType) => (
                          <Group
                            gap="xs"
                            justify="space-between"
                            key={partType}
                            wrap="nowrap"
                          >
                            <Text c="dimmed" size="xs">
                              {partLabels[partType]}
                            </Text>
                            <Text
                              className={classes.partName}
                              fw={500}
                              size="xs"
                            >
                              {message.recommendation?.products[partType].name}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                      <Button
                        color="lime"
                        fullWidth
                        mt="sm"
                        onClick={() => applyBuild(message.recommendation!)}
                        variant="filled"
                      >
                        اعمال این سیستم در لیست قطعات
                      </Button>
                    </Paper>
                  )}
                </div>
              ))}
              {isThinking && (
                <Group
                  className={`${classes.message} ${classes.assistantMessage}`}
                  gap="xs"
                >
                  <Loader color="lime" size="xs" />
                  <Text c="dimmed" size="sm">
                    در حال بررسی قیمت و سازگاری قطعات...
                  </Text>
                </Group>
              )}
            </Stack>
          </ScrollArea>

          {messages.length === 1 && (
            <div className={classes.quickPrompts}>
              <Text c="dimmed" fw={600} size="xs">
                پیشنهادهای آماده
              </Text>
              <Group gap="xs" mt="xs">
                {quickPrompts.map((prompt) => (
                  <Button
                    className={classes.quickPrompt}
                    disabled={isThinking}
                    key={prompt}
                    onClick={() => void submitMessage(prompt)}
                    size="compact-sm"
                    variant="light"
                  >
                    {prompt}
                  </Button>
                ))}
              </Group>
            </div>
          )}

          <form className={classes.composer} onSubmit={handleSubmit}>
            <TextInput
              aria-label="پیام به دستیار"
              className={classes.input}
              disabled={isThinking}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="مثلا: یک سیستم تا قیمت ۶۰ میلیون تومان می‌خوام"
              radius="md"
              size="md"
              value={input}
            />
            <ActionIcon
              aria-label="ارسال پیام"
              color="lime"
              disabled={!input.trim() || isThinking}
              radius="md"
              size={42}
              type="submit"
              variant="filled"
            >
              <IconSend size={19} />
            </ActionIcon>
          </form>
          <Text className={classes.scopeNote} c="dimmed" size="xs">
            پیشنهاد سیستم کامل با بودجه، برند، رم و کاربرد دلخواه پشتیبانی
            می‌شود.
          </Text>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default BuildAssistant;
