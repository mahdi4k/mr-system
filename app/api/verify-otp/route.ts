import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

interface VerifyOtpRequest {
  phone: string;
  otp: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  const { phone, otp, name }: VerifyOtpRequest = await req.json();

  console.log("Mock OTP verification for:", phone, "OTP:", otp);

  const mockToken = `mock_token_${Date.now()}`;

  const res = NextResponse.json({
    message: "OTP verified and token stored (Mock)",
    status: true,
    token: mockToken,
  });
  res.cookies.set("authToken", mockToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
