// src/services/order.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { unwrapApiResponse } from "@/lib/http/unwrap";
import type { ApiResponse, PaginationMeta } from "@/lib/http/types";
import type { Order, CreateOrderInput } from "@/types/order";

export type GetOrdersParams = {
  page?: number;
  per_page?: number;
};

function buildOrdersQuery(params?: GetOrdersParams) {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const orderService = {
  createOrder: async (payload: CreateOrderInput) => {
    const response = await apiClient.post<ApiResponse<Order>>(
      endpoints.orders.create,
      payload,
    );
    return unwrapApiResponse(response.data);
  },

  getMyOrders: async (params?: GetOrdersParams) => {
    const query = buildOrdersQuery(params);
    const response = await apiClient.get<
      ApiResponse<{ data: Order[]; meta: PaginationMeta }>
    >(`${endpoints.orders.mine}${query}`);
    return unwrapApiResponse(response.data);
  },

  getOrderById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Order>>(
      endpoints.orders.detail(id),
    );
    return unwrapApiResponse(response.data);
  },
};
