import { NextResponse } from "next/server";
import { createClient } from "../../_lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidConfig(config: unknown): boolean {
  if (typeof config !== "object" || config === null || Array.isArray(config))
    return false;
  const allowedKeys = [
    "cpu",
    "motherboard",
    "ram",
    "graphic",
    "power",
    "ssd",
    "case",
    "fan",
    "ramQuantity",
  ];
  for (const [k, v] of Object.entries(config as Record<string, unknown>)) {
    if (!allowedKeys.includes(k)) return false;
    if (v === null || v === undefined || v === "") continue;
    // ramQuantity is count, others are ids
    if (k === "ramQuantity") {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1 || n > 4) return false;
    } else {
      const n = Number(v);
      if (!Number.isInteger(n) || n <= 0) return false;
    }
  }
  return true;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_systems")
    .select("id, name, config, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    // graceful fallback if migration not yet applied
    if (
      error.message.includes("does not exist") ||
      error.message.includes("relation")
    ) {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { name, config } = body as { name?: unknown; config?: unknown };

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 50
  ) {
    return NextResponse.json(
      { message: "نام سیستم باید بین ۲ تا ۵۰ نویسه باشد" },
      { status: 400 },
    );
  }
  if (!isValidConfig(config)) {
    return NextResponse.json(
      { message: "پیکربندی سیستم نامعتبر است" },
      { status: 400 },
    );
  }

  // limit: max 20 saved systems per user
  const { count, error: countError } = await supabase
    .from("saved_systems")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (
    countError &&
    (countError.message.includes("does not exist") ||
      countError.message.includes("relation"))
  ) {
    // table not yet migrated — will be handled on insert error as well
  } else if ((count ?? 0) >= 20) {
    return NextResponse.json(
      { message: "حداکثر ۲۰ سیستم می‌توانید ذخیره کنید" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("saved_systems")
    .insert({
      user_id: user.id,
      name: name.trim(),
      config: config as never,
    })
    .select("id, name, config, created_at, updated_at")
    .single();

  if (error) {
    if (
      error.message.includes("does not exist") ||
      error.message.includes("relation")
    ) {
      return NextResponse.json(
        {
          message:
            "جدول ذخیره‌سازی هنوز آماده نشده — لطفاً مایگریشن را اعمال کنید",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
