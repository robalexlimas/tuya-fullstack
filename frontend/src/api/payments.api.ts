import { httpClient } from "@api/httpClient";
import type {
    BackendTransactionDto,
    CreatePaymentInput,
    CreatePurchaseInput,
    CreateRefundInput,
    FinalizeTransactionInput,
} from "@models/payments.model";

export const paymentsApi = {
    // PAYMENT
    createPayment: async (input: CreatePaymentInput) => {
        const { data } = await httpClient.post<BackendTransactionDto>("/payments", input);
        return data;
    },

    // PURCHASE
    createPurchase: async (input: CreatePurchaseInput) => {
        const { data } = await httpClient.post<BackendTransactionDto>("/purchases", input);
        return data;
    },

    // REFUND
    createRefund: async (input: CreateRefundInput) => {
        const { data } = await httpClient.post<BackendTransactionDto>("/refunds", input);
        return data;
    },

    // Finalize pending tx
    finalize: async (transactionId: string, input: FinalizeTransactionInput) => {
        const { data } = await httpClient.put<BackendTransactionDto>(
            `/transactions/${transactionId}/status`,
            input
        );
        return data;
    },
};
