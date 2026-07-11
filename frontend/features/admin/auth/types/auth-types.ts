export type AdminUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: "admin" | string;
  status: "active" | "inactive" | string;
};

export type AdminLoginResponse = {
  token: string;
  user: AdminUser;
};
