import { NextResponse } from "next/server";
import { createClient } from "../../_lib/supabase/server";

interface ProfileUpdateBody {
  email?: string;
  name?: string;
  phone?: string;
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ProfileUpdateBody;
  if (body.name !== undefined) {
    const name = body.name.trim();
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ message: "نام معتبر نیست." }, { status: 400 });
    }
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name })
      .eq("id", user.id);
    if (error) {
      return NextResponse.json(
        { message: "ویرایش پروفایل ناموفق بود." },
        { status: 500 },
      );
    }
  }

  if (body.email !== undefined) {
    const email = body.email.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "ایمیل معتبر نیست." },
        { status: 400 },
      );
    }
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      return NextResponse.json(
        { message: "ویرایش ایمیل ناموفق بود." },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({ status: true });
}
