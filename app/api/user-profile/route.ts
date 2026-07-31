import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = cookies().get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const mockUserData = {
    id: 1,
    name: "کاربر تست",
    username: "test_user",
    phone: "09123456789",
    email: "test@example.com",
    email_verified_at: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  };

  return NextResponse.json({ message: "user detail", userData: mockUserData });
}
