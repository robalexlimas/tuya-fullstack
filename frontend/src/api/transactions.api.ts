import { httpClient } from "@api/httpClient";
import type {
    BackendTransactionDto,
    BackendTxHistoryDto,
    FinalizeTransactionInput,
    TransactionFilters,
} from "@models/transactions.model";

export const transactionsApi = {
    list: async (filters?: TransactionFilters) => {
        const params: any = {};
        if (filters?.cardId) params.cardId = filters.cardId;
        if (filters?.status) params.status = filters.status;

        const { data } = await httpClient.get<BackendTransactionDto[]>("/transactions", {
            params,
        });
        return data;
    },

    finalize: async (transactionId: string, input: FinalizeTransactionInput) => {
        const { data } = await httpClient.put<BackendTransactionDto>(
            `/transactions/${transactionId}/status`,
            input
        );
        return data;
    },

    history: async (transactionId: string) => {
        const { data } = await httpClient.get<BackendTxHistoryDto[]>(
            `/transactions/${transactionId}/history`
        );
        return data;
    },
};
