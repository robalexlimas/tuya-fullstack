import { httpClient } from "@api/httpClient";
import type { BackendUserSummaryDto } from "@models/dashboard.model";
import type { BackendTransactionDto } from "@models/transactions.model";

export const dashboardApi = {
    summary: async () => {
        const { data } = await httpClient.get<BackendUserSummaryDto>("/transactions/summary");
        return data;
    },

    latestTransactions: async () => {
        // trae todo; luego recortamos a 8 en frontend
        const { data } = await httpClient.get<BackendTransactionDto[]>("/transactions");
        return data;
    },
};
