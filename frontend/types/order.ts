// src/types/order.ts
import type { Course } from "@/types/course";
import type { Payment } from "@/types/payment";
import type { User } from "@/types/user";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | string;

export type OrderItem = {
  id: number;
  order_id: number;
  course_id: number;
  price: number | string;
  discount_amount: number | string;
  final_price: number | string;
  created_at?: string;
  updated_at?: string;

  course?: Course;
};

export type Order = {
  id: number;
  user_id: number;
  order_number: string;
  subtotal: number | string;
  discount_amount: number | string;
  total_amount: number | string;
  status: OrderStatus;
  paid_at: string | null;
  created_at?: string;
  updated_at?: string;

  user?: User;
  items?: OrderItem[];
  payments?: Payment[];
};

export type CreateOrderInput = {
  course_ids: number[];
};
