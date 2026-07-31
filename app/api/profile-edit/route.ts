// src/app/api/updateProfile/route.ts
import { cookies } from "next/headers";

import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const token = cookies().get("authToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email } = await req.json();

    // Call your Laravel backend API to update user profile
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // replace with actual user token
        },
        body: JSON.stringify({ name, email }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { status: false, error: errorData.message },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({
      status: true,
      message: data.message,
      user: data.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}
