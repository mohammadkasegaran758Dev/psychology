// src/types/auth.ts
import type { User } from "@/types/user";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type AuthPayload = {
  user: User;
  token: string;
};

export type AuthResponse = {
  message: string;
  data: AuthPayload;
};
