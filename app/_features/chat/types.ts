export interface ChatParticipant {
  avatarUrl: string | null;
  id: string;
  name: string;
}

export interface ChatAd {
  id: string;
  imageUrl: string | null;
  title: string;
}

export interface Conversation {
  ad: ChatAd;
  buyerId: string;
  createdAt: string;
  id: string;
  otherParticipant: ChatParticipant;
  sellerId: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  data: Conversation[];
  meta: { count: number };
}

export interface ChatMessage {
  content: string;
  conversation_id: string;
  created_at: string;
  id: number;
  read_at: string | null;
  sender_id: string;
}
