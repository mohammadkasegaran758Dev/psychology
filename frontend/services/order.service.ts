// src/services/order.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { storeApi } from "@/lib/http/store-api";
import { unwrapApiResponse, unwrapPaginated } from "@/lib/http/unwrap";
import type { Order, CreateOrderInput } from "@/types/order";

export type GetOrdersParams = {
  page?: number;
  per_page?: number;
};

function buildOrdersQuery(params?: GetOrdersParams) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  const q = searchParams.toString();
  return q ? `?${q}` : "";
}

export const orderService = {
  createOrder: async (payload: CreateOrderInput) => {
    const res = await storeApi.post(endpoints.orders.create, payload);
    return unwrapApiResponse<Order>(res as any);
  },

  getMyOrders: async (params?: GetOrdersParams) => {
    const res = await storeApi.get(
      `${endpoints.orders.mine}${buildOrdersQuery(params)}`,
    );
    return unwrapPaginated<Order>(res as any);
  },

  getOrderById: async (id: string | number) => {
    const res = await storeApi.get(endpoints.orders.detail(id));
    return unwrapApiResponse<Order>(res as any);
  },
};
