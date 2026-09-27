import fs from "node:fs";
import path from "node:path";

const USER_MIGRATION =
  "supabase/migrations/20260926000000_admin_user_management.sql";

function read(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("admin user management migration", () => {
  const migration = read(USER_MIGRATION);

  it("mirrors the GoTrue account fields onto profiles", () => {
    expect(migration).toContain("add column if not exists email text");
    expect(migration).toContain("add column if not exists role text");
    expect(migration).toContain(
      "add column if not exists banned_until timestamptz",
    );
    expect(migration).toContain("add column if not exists ban_reason text");
    expect(migration).toContain(
      "add column if not exists last_sign_in_at timestamptz",
    );
  });

  it("keeps the role constrained to the admin roles", () => {
    expect(migration).toContain("check (role in ('user', 'admin'))");
  });

  it("derives the mirrored role from the trusted app_metadata", () => {
    expect(migration).toContain("create trigger on_auth_user_updated");
    expect(migration).toContain("new.raw_app_meta_data ->> 'role' = 'admin'");
  });

  it("backfills existing auth accounts", () => {
    expect(migration).toContain("from auth.users as users");
    expect(migration).toContain("on conflict (id) do update");
  });

  it("lets only administrators update other profiles", () => {
    expect(migration).toContain(
      'create policy "Administrators update all profiles"',
    );
    expect(migration).toContain("on public.profiles for update");
    expect(migration).toContain(
      "coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'",
    );
  });

  it("exposes the activity counter only to the service role", () => {
    expect(migration).toContain(
      "create or replace function public.admin_user_stats",
    );
    expect(migration).toContain("set search_path = ''");
    expect(migration).toContain(
      "revoke all on function public.admin_user_stats(uuid[]) from public, anon, authenticated",
    );
    expect(migration).toContain(
      "grant execute on function public.admin_user_stats(uuid[]) to service_role",
    );
  });

  it("does not contain a service-role credential", () => {
    expect(migration.toLowerCase()).not.toContain("service_role_key");
    expect(migration).not.toMatch(/sb_secret_[A-Za-z0-9]/);
  });
});

describe("admin user management API", () => {
  const searchFilters = read("app/_features/users/filters.ts");
  const listRoute = read("app/api/dashboard/users/route.ts");
  const userRoute = read("app/api/dashboard/users/[id]/route.ts");
  const resetRoute = read(
    "app/api/dashboard/users/[id]/password-reset/route.ts",
  );

  it("authorizes every endpoint through the admin session guard", () => {
    for (const route of [listRoute, userRoute, resetRoute]) {
      expect(route).toContain("getAdminSession()");
      expect(route).toContain('return failure("Unauthorized", 401)');
    }
  });

  it("rejects malformed ids before touching the database", () => {
    expect(userRoute).toContain("isValidUuid");
    expect(userRoute).toContain('return failure("Invalid user ID", 400)');
  });

  it("sanitizes the search term before building the PostgREST filter", () => {
    expect(searchFilters).toContain("export function sanitizeUserSearch");
    expect(searchFilters).toContain('replace(/[,()*%\\\\]/g, " ")');
    expect(listRoute).toContain(
      'sanitizeUserSearch(searchParams.get("search"))',
    );
    expect(listRoute).toContain(
      "display_name.ilike.${term},email.ilike.${term},phone.ilike.${term}",
    );
  });

  it("bounds pagination", () => {
    expect(listRoute).toContain("clampInt");
    expect(listRoute).toContain("const MAX_PER_PAGE = 50");
  });

  it("never lets an admin demote, ban, or delete their own account", () => {
    expect(userRoute).toContain("if (id === actor.id)");
    expect(userRoute).toContain("امکان تغییر نقش حساب خودتان وجود ندارد.");
    expect(userRoute).toContain("امکان تغییر وضعیت حساب خودتان وجود ندارد.");
    expect(userRoute).toContain("امکان حذف حساب خودتان وجود ندارد.");
  });

  it("stores the role in the trusted app_metadata, not user_metadata", () => {
    expect(userRoute).toContain("app_metadata: { role }");
    expect(userRoute).not.toContain("user_metadata");
  });

  it("validates the editable profile fields", () => {
    expect(userRoute).toContain("const PHONE_PATTERN = /^0?9[0-9]{9}$/");
    expect(userRoute).toContain("نام نمایشی باید بین ۲ تا ۸۰ نویسه باشد.");
    expect(userRoute).toContain("شماره تماس معتبر نیست.");
  });

  it("sends the recovery email without rewriting the admin session", () => {
    expect(resetRoute).toContain("resetPasswordForEmail");
    expect(resetRoute).toContain("persistSession: false");
    expect(resetRoute).toContain("auth.admin.getUserById");
  });
});

describe("admin user management dashboard", () => {
  const client = read("app/(routes)/dashboard/users/UsersClient.tsx");
  const navbar = read("app/(routes)/dashboard/(navbar)/Navbar.tsx");
  const adminAuth = read("app/_lib/supabase/adminAuth.ts");

  it("is reachable from the dashboard navigation", () => {
    expect(navbar).toContain('href="/dashboard/users"');
    expect(navbar).toContain("مدیریت کاربران");
  });

  it("resolves the acting admin so self actions can be disabled", () => {
    expect(adminAuth).toContain("export async function getAdminSession");
    expect(client).toContain("currentUserId");
    expect(client).toContain("disabled={isSelf");
  });

  it("reports failures instead of failing silently", () => {
    expect(client).toContain('notifications.show({ color: "red"');
    expect(client).toContain("throw new Error(readMessage(body)");
  });

  it("offers the full moderation action set", () => {
    expect(client).toContain("ویرایش پروفایل");
    expect(client).toContain("اعطای دسترسی مدیریت");
    expect(client).toContain("ارسال ایمیل بازیابی رمز");
    expect(client).toContain("مسدودسازی");
    expect(client).toContain("برداشتن مسدودی");
    expect(client).toContain("حذف دائمی");
  });
});
