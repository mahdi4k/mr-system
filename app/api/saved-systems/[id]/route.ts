import { NextResponse } from "next/server";
import { createClient } from "../../../_lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isValidUuid(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { error, count } = await supabase
    .from("saved_systems")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  if ((count ?? 0) === 0)
    return NextResponse.json({ message: "یافت نشد" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isValidUuid(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

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

  const { name } = body as { name?: unknown };
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

  const { data, error } = await supabase
    .from("saved_systems")
    .update({ name: name.trim() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, name, config, created_at, updated_at")
    .single();

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
