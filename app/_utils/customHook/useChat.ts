"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useChat = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const currentUser = { id: userId };

  // Fetch conversations
  useEffect(() => {
    fetch("/api/conversations").then((res) => console.log(res));
    // .then(setConversations);
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetch(`/api/conversations/${selectedConversation.id}/messages`)
        .then((res) => res.json())
        .then(setMessages);
    }
  }, [selectedConversation]);

  const createConversation = async (adId: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ adId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create conversation:", errorData);
        throw new Error(errorData.message || "Failed to create conversation");
      }

      const newConversation = await response.json();
      router.push(`/chat?conversationId=${newConversation.id}`);
      setConversations((prev) => [...prev, newConversation]);
      setSelectedConversation(newConversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to create a conversation. Please try again later.");
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;
    console.log(currentUser.id, "currentUser.id");

    // Optimistic update
    const newMessage = {
      id: Date.now(),
      content: message,
      senderId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Save to backend
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        content: message,
        conversationId: selectedConversation.id,
      }),
      headers: { "Content-Type": "application/json" },
    });

    // Refresh messages
    const updatedMessages = await fetch(
      `/api/messages?conversationId=${selectedConversation.id}`,
    ).then((res) => res.json());
    setMessages(updatedMessages);
  };

  return {
    conversations,
    selectedConversation,
    messages,
    message,
    setMessage,
    createConversation,
    selectConversation: setSelectedConversation,
    sendMessage,
  };
};
