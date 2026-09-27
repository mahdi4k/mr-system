import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../_lib/supabase/adminAuth";
import type { Database } from "../../../../types/database.types";
import type { UserActionPayload } from "../../../../_features/users/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PHONE_PATTERN = /^0?9[0-9]{9}$/;
const BAN_YEARS = 100;
const BAN_DURATION = `${BAN_YEARS * 365 * 24}h`;

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function failure(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function bannedUntilIso(): string {
  return new Date(
    Date.now() + BAN_YEARS * 365 * 24 * 60 * 60 * 1000,
  ).toISOString();
}

/**
 * An admin must never be able to lock themselves out: banning or unbanning their
 * own account is rejected before any write happens.
 */
function isSelfBan(
  targetId: string,
  actorId: string,
  action: UserActionPayload["action"],
): boolean {
  if (targetId !== actorId) return false;
  return action === "set_ban" || action === "unban";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return failure("Unauthorized", 401);
  const { client: admin, user: actor } = session;

  const { id } = await params;
  if (!isValidUuid(id)) return failure("Invalid user ID", 400);

  const body = (await request
    .json()
    .catch(() => null)) as Partial<UserActionPayload> | null;
  if (!body || typeof body.action !== "string") {
    return failure("Invalid request body", 400);
  }

  if (isSelfBan(id, actor.id, body.action)) {
    return failure("امکان تغییر وضعیت حساب خودتان وجود ندارد.", 400);
  }

  if (body.action === "update_profile") {
    const patch: Database["public"]["Tables"]["profiles"]["Update"] = {};

    if ("display_name" in body) {
      const displayName = (body.display_name ?? "").trim();
      if (displayName && (displayName.length < 2 || displayName.length > 80)) {
        return failure("نام نمایشی باید بین ۲ تا ۸۰ نویسه باشد.", 400);
      }
      patch.display_name = displayName || null;
    }

    if ("phone" in body) {
      const phone = (body.phone ?? "").trim().replace(/[\s-]/g, "");
      if (phone && !PHONE_PATTERN.test(phone)) {
        return failure("شماره تماس معتبر نیست.", 400);
      }
      patch.phone = phone || null;
    }

    if ("avatar_url" in body) {
      const avatarUrl = (body.avatar_url ?? "").trim();
      if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
        return failure("نشانی تصویر معتبر نیست.", 400);
      }
      patch.avatar_url = avatarUrl || null;
    }

    if (Object.keys(patch).length === 0) {
      return failure("هیچ فیلدی برای ویرایش ارسال نشده است.", 400);
    }

    const { data, error } = await admin
      .from("profiles")
      .update(patch)
      .eq("id", id)
      .select("id, display_name, email, phone, avatar_url, role")
      .maybeSingle();

    if (error) return failure(error.message, 500);
    if (!data) return failure("User not found", 404);
    return NextResponse.json({ ok: true, user: data });
  }

  if (body.action === "set_role") {
    const role = body.role;
    if (role !== "admin" && role !== "user") {
      return failure("نقش کاربری معتبر نیست.", 400);
    }
    if (id === actor.id) {
      return failure("امکان تغییر نقش حساب خودتان وجود ندارد.", 400);
    }

    const { error: authError } = await admin.auth.admin.updateUserById(id, {
      app_metadata: { role },
    });
    if (authError) return failure(authError.message, 500);

    // The auth trigger mirrors app_metadata onto profiles; write it as well so the
    // dashboard stays correct even if the migration has not been applied yet.
    const { error } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", id);
    if (error) return failure(error.message, 500);

    return NextResponse.json({ ok: true, role });
  }

  if (body.action === "set_ban" || body.action === "unban") {
    const banning = body.action === "set_ban";
    const banReason = (body.ban_reason ?? "").trim().slice(0, 200) || null;

    const { error: authError } = await admin.auth.admin.updateUserById(id, {
      ban_duration: banning ? BAN_DURATION : "none",
    });
    if (authError) return failure(authError.message, 500);

    const { error } = await admin
      .from("profiles")
      .update({
        banned_until: banning ? bannedUntilIso() : null,
        ban_reason: banning ? banReason : null,
      })
      .eq("id", id);
    if (error) return failure(error.message, 500);

    return NextResponse.json({
      ok: true,
      status: banning ? "banned" : "active",
    });
  }

  return failure("Unsupported action", 400);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return failure("Unauthorized", 401);
  const { client: admin, user: actor } = session;

  const { id } = await params;
  if (!isValidUuid(id)) return failure("Invalid user ID", 400);
  if (id === actor.id) {
    return failure("امکان حذف حساب خودتان وجود ندارد.", 400);
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return failure(error.message, 500);

  return NextResponse.json({ ok: true });
}
