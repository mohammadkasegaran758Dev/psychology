// src/services/payment.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { unwrapApiResponse } from "@/lib/http/unwrap";
import type { ApiResponse, PaginationMeta } from "@/lib/http/types";
import type {
  CreatePaymentInput,
  Payment,
  VerifyPaymentInput,
  VerifyPaymentResponse,
} from "@/types/payment";

export type GetPaymentsParams = {
  page?: number;
  per_page?: number;
};

function buildPaymentsQuery(params?: GetPaymentsParams) {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const paymentService = {
  createPayment: async (payload: CreatePaymentInput) => {
    const response = await apiClient.post<ApiResponse<Payment>>(
      endpoints.payments.create,
      payload,
    );
    return unwrapApiResponse(response.data);
  },

  getMyPayments: async (params?: GetPaymentsParams) => {
    const query = buildPaymentsQuery(params);
    const response = await apiClient.get<
      ApiResponse<{ data: Payment[]; meta: PaginationMeta }>
    >(`${endpoints.payments.mine}${query}`);
    return unwrapApiResponse(response.data);
  },

  getPaymentById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Payment>>(
      endpoints.payments.detail(id),
    );
    return unwrapApiResponse(response.data);
  },

  verifyPayment: async (payload: VerifyPaymentInput) => {
    const response = await apiClient.post<ApiResponse<VerifyPaymentResponse>>(
      endpoints.payments.verify,
      payload,
    );
    return unwrapApiResponse(response.data);
  },
};
