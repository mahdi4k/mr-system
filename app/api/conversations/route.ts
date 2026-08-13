import { NextResponse } from "next/server";
import type {
  Conversation,
  ConversationsResponse,
} from "../../_features/chat/types";
import { createClient } from "../../_lib/supabase/server";

interface ConversationRow {
  ad: {
    id: string;
    images: Array<{ sort_order: number; url: string }>;
    title: string;
  };
  buyer: {
    avatar_url: string | null;
    display_name: string | null;
    id: string;
  };
  buyer_id: string;
  created_at: string;
  id: string;
  seller: {
    avatar_url: string | null;
    display_name: string | null;
    id: string;
  };
  seller_id: string;
  updated_at: string;
}

function toConversation(row: ConversationRow, userId: string): Conversation {
  const other = row.buyer_id === userId ? row.seller : row.buyer;
  const firstImage = [...(row.ad.images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0];

  return {
    id: row.id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ad: {
      id: row.ad.id,
      title: row.ad.title,
      imageUrl: firstImage?.url ?? null,
    },
    otherParticipant: {
      id: other.id,
      name: other.display_name || "کاربر ریگورا",
      avatarUrl: other.avatar_url,
    },
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { adId?: string };
  if (!body.adId) {
    return NextResponse.json(
      { message: "شناسه آگهی الزامی است." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("get_or_create_conversation", {
    ad_uuid: body.adId,
  });
  if (error) {
    return NextResponse.json(
      { message: "ایجاد گفت‌وگو ممکن نیست." },
      { status: 400 },
    );
  }

  return NextResponse.json({ id: data });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error, count } = await supabase
    .from("conversations")
    .select(
      `
        id,
        buyer_id,
        seller_id,
        created_at,
        updated_at,
        ad:ads!conversations_ad_id_fkey(id, title, images:ad_images(url, sort_order)),
        buyer:profiles!conversations_buyer_id_fkey(id, display_name, avatar_url),
        seller:profiles!conversations_seller_id_fkey(id, display_name, avatar_url)
      `,
      { count: "exact" },
    )
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: "دریافت گفت‌وگوها ناموفق بود." },
      { status: 500 },
    );
  }

  const response: ConversationsResponse = {
    data: ((data ?? []) as unknown as ConversationRow[]).map((row) =>
      toConversation(row, user.id),
    ),
    meta: { count: count ?? 0 },
  };
  return NextResponse.json(response);
}
