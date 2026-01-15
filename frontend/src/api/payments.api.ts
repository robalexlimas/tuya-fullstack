import { httpClient } from "@api/httpClient";
import type {
    BackendTransactionDto,
    CreatePaymentInput,
    FinalizeTransactionInput,
} from "@models/payments.model";

export const paymentsApi = {
    // PAYMENT
    createPayment: async (input: CreatePaymentInput) => {
        const { data } = await httpClient.post<BackendTransactionDto>("/payments", input);
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
