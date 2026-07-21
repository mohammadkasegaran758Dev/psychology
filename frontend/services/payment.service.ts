// src/services/payment.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { storeApi } from "@/lib/http/store-api";
import { unwrapApiResponse, unwrapPaginated } from "@/lib/http/unwrap";
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
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  const q = searchParams.toString();
  return q ? `?${q}` : "";
}

export const paymentService = {
  createPayment: async (payload: CreatePaymentInput) => {
    const res = await storeApi.post(endpoints.payments.create, payload);
    return unwrapApiResponse<Payment>(res as any);
  },

  getMyPayments: async (params?: GetPaymentsParams) => {
    const res = await storeApi.get(
      `${endpoints.payments.mine}${buildPaymentsQuery(params)}`,
    );
    return unwrapPaginated<Payment>(res as any);
  },

  getPaymentById: async (id: string | number) => {
    const res = await storeApi.get(endpoints.payments.detail(id));
    return unwrapApiResponse<Payment>(res as any);
  },

  verifyPayment: async (payload: VerifyPaymentInput) => {
    const res = await storeApi.post(endpoints.payments.verify, payload);
    return unwrapApiResponse<VerifyPaymentResponse>(res as any);
  },
};
