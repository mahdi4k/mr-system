import type { UserRole } from "../../types/database.types";

export type UserAccountStatus = "active" | "banned";

export interface UserActivity {
  ads_count: number;
  articles_count: number;
  conversations_count: number;
  saved_systems_count: number;
}

export interface AdminUser {
  activity: UserActivity;
  avatar_url: string | null;
  ban_reason: string | null;
  banned_until: string | null;
  created_at: string;
  display_name: string | null;
  email: string | null;
  id: string;
  last_sign_in_at: string | null;
  phone: string | null;
  role: UserRole;
  status: UserAccountStatus;
}

export interface UsersListResponse {
  data: AdminUser[];
  page: number;
  perPage: number;
  lastPage: number;
  total: number;
  summary: {
    total: number;
    admins: number;
    banned: number;
  };
}

export type UserRoleFilter = UserRole | "all";
export type UserStatusFilter = UserAccountStatus | "all";

export interface UsersQuery {
  page?: number;
  perPage?: number;
  search?: string;
  role?: UserRoleFilter;
  status?: UserStatusFilter;
}

export type UserAction = "update_profile" | "set_role" | "set_ban" | "unban";

export interface UserActionPayload {
  action: UserAction;
  display_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: UserRole;
  ban_reason?: string;
}

export const EMPTY_ACTIVITY: UserActivity = {
  ads_count: 0,
  articles_count: 0,
  conversations_count: 0,
  saved_systems_count: 0,
};

export const USERS_PER_PAGE = 10;
