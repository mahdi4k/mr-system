import { NextResponse } from "next/server";

import { cookies } from "next/headers";

export interface Apiconversation {
  data: Transaction[];
  meta: {
    count: number;
  };
}

export interface Transaction {
  id: number;
  product_id: number;
  user_id: number;
  seller_id: number;
  created_at: string;
  updated_at: string;
  product: Product;
  buyer: User;
  seller: User;
}

interface Product {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  image: string;
  city: string;
  ostan: string;
  price: number | null;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    product_id: 1,
    user_id: 1,
    seller_id: 2,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    product: {
      id: 1,
      user_id: 2,
      category_id: 1,
      title: "کامپیوتر گیمینگ",
      image: '["https://via.placeholder.com/400x300"]',
      city: "تهران",
      ostan: "1",
      price: 45000000,
      description: "سیستم گیمینگ حرفه‌ای",
      status: "active",
      created_at: "2024-01-14T09:00:00Z",
      updated_at: "2024-01-14T09:00:00Z",
    },
    buyer: {
      id: 1,
      name: "کاربر خریدار",
      username: "buyer_user",
      phone: "09123456789",
      email: "buyer@test.com",
      email_verified_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    seller: {
      id: 2,
      name: "فروشنده",
      username: "seller_user",
      phone: "09123456790",
      email: "seller@test.com",
      email_verified_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
];

export async function POST(request: Request) {
  const token = cookies().get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { adId } = await request.json();

    if (!adId) {
      return NextResponse.json(
        { error: "Missing adId in request body" },
        { status: 400 },
      );
    }

    const mockResponse = {
      id: 1,
      product_id: adId,
      user_id: 1,
      seller_id: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("Error in POST /api/conversations:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const token = cookies().get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    data: mockTransactions,
    meta: {
      count: mockTransactions.length,
    },
  });
}
