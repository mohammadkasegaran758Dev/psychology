// src/services/order.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/types/api";
import type { Order, CreateOrderInput } from "@/types/order";

export type GetOrdersParams = {
  page?: number;
  limit?: number;
};

function buildOrdersQuery(params?: GetOrdersParams) {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const orderService = {
  createOrder: async (payload: CreateOrderInput) => {
    return apiClient.post<Order>(endpoints.orders.create, payload);
  },

  getMyOrders: async (params?: GetOrdersParams) => {
    const query = buildOrdersQuery(params);
    return apiClient.get<PaginatedResponse<Order>>(
      `${endpoints.orders.mine}${query}`,
    );
  },

  getOrderById: async (id: string | number) => {
    return apiClient.get<Order>(endpoints.orders.detail(id));
  },
};
