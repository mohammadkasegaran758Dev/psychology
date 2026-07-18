// src/services/payment.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreatePaymentInput,
  Payment,
  VerifyPaymentInput,
  VerifyPaymentResponse,
} from "@/types/payment";

export type GetPaymentsParams = {
  page?: number;
  limit?: number;
};

function buildPaymentsQuery(params?: GetPaymentsParams) {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const paymentService = {
  createPayment: async (payload: CreatePaymentInput) => {
    return apiClient.post<Payment>(endpoints.payments.create, payload);
  },

  getMyPayments: async (params?: GetPaymentsParams) => {
    const query = buildPaymentsQuery(params);
    return apiClient.get<PaginatedResponse<Payment>>(
      `${endpoints.payments.mine}${query}`,
    );
  },

  getPaymentById: async (id: string | number) => {
    return apiClient.get<Payment>(endpoints.payments.detail(id));
  },

  verifyPayment: async (payload: VerifyPaymentInput) => {
    return apiClient.post<VerifyPaymentResponse>(
      endpoints.payments.verify,
      payload,
    );
  },
};
