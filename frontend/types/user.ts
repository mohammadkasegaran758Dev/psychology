// src/types/user.ts
export type UserRole = "admin" | "student" | string;
export type UserStatus = "active" | "inactive" | "banned" | string;

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  is_admin?: boolean;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
