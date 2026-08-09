import { NextResponse } from "next/server";
import { createClient } from "../../_lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name, phone, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { message: "دریافت پروفایل ناموفق بود." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "user detail",
    userData: {
      id: profile.id,
      name: profile.display_name ?? "",
      phone: profile.phone ?? "",
      email: user.email ?? null,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    },
  });
}
