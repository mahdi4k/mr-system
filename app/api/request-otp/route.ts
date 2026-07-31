import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface RequestOtpRequest {
  phone: string;
}

export async function POST(req: NextRequest) {
  const { phone }: RequestOtpRequest = await req.json();

  console.log("Mock OTP request for:", phone);

  return NextResponse.json(
    { message: "OTP sent successfully (Mock)" },
    { status: 200 },
  );
}
