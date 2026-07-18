// src/types/payment.ts
import type { Order } from "@/types/order";
import type { User } from "@/types/user";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | string;

export type Payment = {
  id: number;
  order_id: number;
  user_id: number;
  gateway: string;
  status: PaymentStatus;
  amount: number | string;
  authority: string | null;
  ref_id: string | null;
  gateway_response: Record<string, unknown> | null;
  paid_at: string | null;
  created_at?: string;
  updated_at?: string;

  order?: Order;
  user?: User;
};

export type CreatePaymentInput = {
  order_id: number;
  gateway: string;
};

export type VerifyPaymentInput = {
  authority: string;
  status?: string;
};

export type VerifyPaymentResponse = {
  success: boolean;
  message?: string;
  payment?: Payment;
  ref_id?: string | null;
};
