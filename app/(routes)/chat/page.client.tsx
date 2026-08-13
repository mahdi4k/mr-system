"use client";

import type {
  ChatMessage,
  Conversation,
  ConversationsResponse,
} from "../../_features/chat/types";
import { createClient } from "../../_lib/supabase/client";
import { formatJalaliTimeAgo } from "../../_utils/utils";
import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowRight,
  IconCircleArrowUpFilled,
  IconMessageCircle,
  IconRefresh,
} from "@tabler/icons-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NoMessageSvg from "../../../public/svg/no-message.svg";
import styles from "./Chat.module.css";

function ConversationImage({ conversation }: { conversation: Conversation }) {
  return conversation.ad.imageUrl ? (
    <Image
      alt={conversation.ad.title}
      className={styles.productImage}
      height={44}
      src={conversation.ad.imageUrl}
      width={44}
    />
  ) : (
    <Avatar color="gray" radius="md" size={44}>
      <IconMessageCircle size={20} />
    </Avatar>
  );
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const requestedConversationId = searchParams.get("conversationId");
  const viewport = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    window.setTimeout(() => {
      viewport.current?.scrollTo({
        top: viewport.current.scrollHeight,
        behavior,
      });
    }, 50);
  };

  const fetchConversations = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/conversations");
      const data = (await response.json()) as ConversationsResponse & {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(data.message || "دریافت گفت‌وگوها ناموفق بود.");
      }
      setConversations(data.data);
      setSelectedConversation((current) => {
        if (current) {
          return data.data.find(({ id }) => id === current.id);
        }
        if (requestedConversationId) {
          return data.data.find(({ id }) => id === requestedConversationId);
        }
        return undefined;
      });
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "دریافت گفت‌وگوها ناموفق بود.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void createClient()
      .auth.getUser()
      .then(({ data }) => setCurrentUserId(data.user?.id));
    void fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    let active = true;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await fetch(
          `/api/conversations/${selectedConversation.id}/messages`,
        );
        const data = (await response.json()) as
          | ChatMessage[]
          | { message: string };
        if (!response.ok || !Array.isArray(data)) {
          throw new Error(
            !Array.isArray(data) ? data.message : "دریافت پیام‌ها ناموفق بود.",
          );
        }
        if (active) {
          setMessages(data);
          scrollToBottom("auto");
        }
      } catch (fetchError) {
        if (active) {
          notifications.show({
            color: "red",
            message:
              fetchError instanceof Error
                ? fetchError.message
                : "دریافت پیام‌ها ناموفق بود.",
          });
        }
      } finally {
        if (active) setLoadingMessages(false);
      }
    };
    void fetchMessages();

    const supabase = createClient();
    const channel = supabase
      .channel(`conversation:${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        ({ new: insertedMessage }) => {
          const message = insertedMessage as ChatMessage;
          setMessages((current) =>
            current.some(({ id }) => id === message.id)
              ? current
              : [...current, message],
          );
          scrollToBottom();
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [selectedConversation?.id]);

  const handleSendMessage = async (): Promise<void> => {
    const content = newMessage.trim();
    if (!selectedConversation || !content || sending) return;

    setSending(true);
    try {
      const response = await fetch(
        `/api/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        },
      );
      const data = (await response.json()) as ChatMessage & {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(data.message || "ارسال پیام ناموفق بود.");
      }
      setMessages((current) =>
        current.some(({ id }) => id === data.id) ? current : [...current, data],
      );
      setNewMessage("");
      scrollToBottom();
      void fetchConversations();
    } catch (sendError) {
      notifications.show({
        color: "red",
        message:
          sendError instanceof Error
            ? sendError.message
            : "ارسال پیام ناموفق بود.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container className={styles.container} my="lg" size="lg">
      <Group justify="space-between" mb="md">
        <Title order={2}>پیام‌ها</Title>
        <ActionIcon
          aria-label="به‌روزرسانی گفت‌وگوها"
          loading={loading}
          onClick={fetchConversations}
          variant="subtle"
        >
          <IconRefresh size={19} />
        </ActionIcon>
      </Group>

      {error && (
        <Alert color="red" mb="md" title="بارگذاری گفت‌وگوها ناموفق بود">
          <Text fz="sm" mb="sm">
            {error}
          </Text>
          <Button color="red" onClick={fetchConversations} variant="light">
            تلاش دوباره
          </Button>
        </Alert>
      )}

      {loading && conversations.length === 0 ? (
        <Paper p="md" withBorder>
          <Stack>
            {[0, 1, 2].map((item) => (
              <Skeleton height={74} key={item} radius="md" />
            ))}
          </Stack>
        </Paper>
      ) : conversations.length > 0 ? (
        <Paper className={styles.chatShell} withBorder>
          <Box
            className={styles.sidebar}
            data-hidden={Boolean(selectedConversation) || undefined}
          >
            <Stack gap="xs">
              {conversations.map((conversation) => (
                <Card
                  className={styles.conversationCard}
                  data-active={
                    selectedConversation?.id === conversation.id || undefined
                  }
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  padding="sm"
                  radius="md"
                  withBorder
                >
                  <Group wrap="nowrap">
                    <ConversationImage conversation={conversation} />
                    <Box flex={1} miw={0}>
                      <Text fw={600} fz="sm" truncate>
                        {conversation.otherParticipant.name}
                      </Text>
                      <Text c="dimmed" fz="xs" truncate>
                        {conversation.ad.title}
                      </Text>
                    </Box>
                    <Text c="dimmed" fz={10}>
                      {formatJalaliTimeAgo(conversation.updatedAt)}
                    </Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Box>

          <Box
            className={styles.messagePanel}
            data-visible={Boolean(selectedConversation) || undefined}
          >
            {selectedConversation ? (
              <>
                <Group className={styles.chatHeader} wrap="nowrap">
                  <ActionIcon
                    aria-label="بازگشت به گفت‌وگوها"
                    className={styles.backButton}
                    onClick={() => setSelectedConversation(undefined)}
                    variant="subtle"
                  >
                    <IconArrowRight size={19} />
                  </ActionIcon>
                  <ConversationImage conversation={selectedConversation} />
                  <Box miw={0}>
                    <Text fw={700} fz="sm" truncate>
                      {selectedConversation.otherParticipant.name}
                    </Text>
                    <Text c="dimmed" fz="xs" truncate>
                      {selectedConversation.ad.title}
                    </Text>
                  </Box>
                </Group>
                <Divider />

                <ScrollArea
                  className={styles.messages}
                  offsetScrollbars
                  viewportRef={viewport}
                >
                  {loadingMessages ? (
                    <Flex h="100%" align="center" justify="center">
                      <Loader size="sm" />
                    </Flex>
                  ) : messages.length ? (
                    <Stack gap="sm">
                      {messages.map((message) => {
                        const ownMessage = message.sender_id === currentUserId;
                        return (
                          <Flex
                            justify={ownMessage ? "flex-start" : "flex-end"}
                            key={message.id}
                          >
                            <Card
                              className={styles.messageBubble}
                              data-own={ownMessage || undefined}
                              padding="sm"
                              radius="lg"
                            >
                              <Text className={styles.messageContent} fz="sm">
                                {message.content}
                              </Text>
                              <Text c="dimmed" fz={10} mt={4}>
                                {formatJalaliTimeAgo(message.created_at)}
                              </Text>
                            </Card>
                          </Flex>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Flex h="100%" align="center" justify="center">
                      <Text c="dimmed" fz="sm">
                        اولین پیام این گفت‌وگو را ارسال کنید.
                      </Text>
                    </Flex>
                  )}
                </ScrollArea>

                <Box className={styles.composer}>
                  <TextInput
                    disabled={sending}
                    maxLength={2000}
                    onChange={(event) =>
                      setNewMessage(event.currentTarget.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                    placeholder="پیام خود را بنویسید..."
                    rightSection={
                      <ActionIcon
                        aria-label="ارسال پیام"
                        disabled={!newMessage.trim()}
                        loading={sending}
                        onClick={handleSendMessage}
                        variant="transparent"
                      >
                        <IconCircleArrowUpFilled size={24} />
                      </ActionIcon>
                    }
                    size="lg"
                    value={newMessage}
                  />
                </Box>
              </>
            ) : (
              <Flex
                className={styles.selectPrompt}
                align="center"
                justify="center"
              >
                <Text c="dimmed">یک گفت‌وگو را انتخاب کنید.</Text>
              </Flex>
            )}
          </Box>
        </Paper>
      ) : (
        <Paper p="xl" withBorder>
          <Flex direction="column" align="center" ta="center">
            <Image
              alt="گفت‌وگویی وجود ندارد"
              className={styles.imgNoDescription}
              src={NoMessageSvg}
            />
            <Title order={3} mt="lg">
              هنوز گفت‌وگویی ندارید
            </Title>
            <Text c="dimmed" fz="sm" mt="xs" maw={460}>
              از صفحه یک آگهی، دکمه گفت‌وگو را انتخاب کنید تا با فروشنده در
              ارتباط باشید.
            </Text>
          </Flex>
        </Paper>
      )}
    </Container>
  );
}
