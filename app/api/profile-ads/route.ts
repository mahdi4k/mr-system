import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = cookies().get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const mockUserAds = {
    data: [
      {
        id: 1,
        title: "سیستم گیمینگ من",
        price: "45000000",
        status: "active",
        created_at: "2024-01-15T10:30:00Z",
      },
    ],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 1,
  };

  return NextResponse.json({
    message: "Product created successfully",
    userData: mockUserAds,
  });
}
