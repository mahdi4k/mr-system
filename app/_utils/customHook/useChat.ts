"use client";

import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateConversationResponse {
  id?: string;
  message?: string;
}

export const useChat = () => {
  const [creatingConversation, setCreatingConversation] = useState(false);
  const router = useRouter();

  const createConversation = async (adId: string): Promise<void> => {
    setCreatingConversation(true);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ adId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = (await response.json()) as CreateConversationResponse;
      if (!response.ok || !data.id) {
        throw new Error(data.message || "ایجاد گفت‌وگو ناموفق بود.");
      }
      router.push(`/chat?conversationId=${data.id}`);
    } catch (error) {
      notifications.show({
        color: "red",
        message:
          error instanceof Error ? error.message : "ایجاد گفت‌وگو ناموفق بود.",
      });
    } finally {
      setCreatingConversation(false);
    }
  };

  return { createConversation, creatingConversation };
};
