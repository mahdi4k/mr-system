import { NextResponse } from "next/server";
import { getAdminSession } from "../../../_lib/supabase/adminAuth";
import {
  clampQueryInt,
  sanitizeUserSearch,
} from "../../../_features/users/filters";
import {
  EMPTY_ACTIVITY,
  USERS_PER_PAGE,
  type AdminUser,
  type UserRoleFilter,
  type UserStatusFilter,
} from "../../../_features/users/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PER_PAGE = 50;

function failure(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return failure("Unauthorized", 401);
  const { client: admin } = session;

  const { searchParams } = new URL(request.url);
  const page = clampQueryInt(searchParams.get("page"), 1, 1, 100000);
  const perPage = clampQueryInt(
    searchParams.get("perPage"),
    USERS_PER_PAGE,
    1,
    MAX_PER_PAGE,
  );
  const search = sanitizeUserSearch(searchParams.get("search"));
  const roleParam = searchParams.get("role");
  const role: UserRoleFilter =
    roleParam === "admin" || roleParam === "user" ? roleParam : "all";
  const statusParam = searchParams.get("status");
  const status: UserStatusFilter =
    statusParam === "active" || statusParam === "banned" ? statusParam : "all";

  const nowIso = new Date().toISOString();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const buildQuery = () => {
    let query = admin
      .from("profiles")
      .select(
        "id, display_name, email, phone, avatar_url, role, ban_reason, banned_until, created_at, last_sign_in_at",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (role !== "all") query = query.eq("role", role);
    if (status === "banned") {
      query = query.not("banned_until", "is", null).gt("banned_until", nowIso);
    }
    if (status === "active") {
      query = query.or(`banned_until.is.null,banned_until.lte.${nowIso}`);
    }
    if (search) {
      const term = `*${search}*`;
      query = query.or(
        `display_name.ilike.${term},email.ilike.${term},phone.ilike.${term}`,
      );
    }
    return query;
  };

  const [listResult, totalResult, adminsResult, bannedResult] =
    await Promise.all([
      buildQuery(),
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin"),
      admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .not("banned_until", "is", null)
        .gt("banned_until", nowIso),
    ]);

  if (listResult.error) {
    return failure(listResult.error.message, 500);
  }

  const rows = listResult.data ?? [];
  const ids = rows.map((row) => row.id);
  const statsByUser = new Map<string, AdminUser["activity"]>();

  if (ids.length) {
    const { data: stats } = await admin.rpc("admin_user_stats", {
      user_ids: ids,
    });
    for (const row of stats ?? []) {
      statsByUser.set(row.user_id, {
        ads_count: Number(row.ads_count ?? 0),
        articles_count: Number(row.articles_count ?? 0),
        conversations_count: Number(row.conversations_count ?? 0),
        saved_systems_count: Number(row.saved_systems_count ?? 0),
      });
    }
  }

  const data: AdminUser[] = rows.map((row) => {
    const bannedUntil = row.banned_until;
    const isBanned = Boolean(bannedUntil && bannedUntil > nowIso);
    return {
      id: row.id,
      display_name: row.display_name,
      email: row.email,
      phone: row.phone,
      avatar_url: row.avatar_url,
      role: row.role,
      ban_reason: row.ban_reason,
      banned_until: bannedUntil,
      created_at: row.created_at,
      last_sign_in_at: row.last_sign_in_at,
      status: isBanned ? "banned" : "active",
      activity: statsByUser.get(row.id) ?? EMPTY_ACTIVITY,
    };
  });

  const total = listResult.count ?? 0;
  return NextResponse.json({
    data,
    page,
    perPage,
    lastPage: Math.max(1, Math.ceil(total / perPage)),
    total,
    summary: {
      total: totalResult.count ?? 0,
      admins: adminsResult.count ?? 0,
      banned: bannedResult.count ?? 0,
    },
  });
}
