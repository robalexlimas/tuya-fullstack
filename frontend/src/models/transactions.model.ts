export type TxStatus = "PENDING" | "COMPLETED" | "FAILED";
export type TxType = "PAYMENT" | "PURCHASE" | "REFUND";

export type BackendTransactionDto = {
    transactionId: string;
    cardId: string;
    userId: string;
    type: TxType;
    amount: number;
    currency: string;
    merchant?: string | null;
    description?: string | null;
    status: TxStatus;
    createdAtUtc: string;
};

export type Transaction = {
    id: string;
    cardId: string;
    type: TxType;
    amount: number;
    currency: string;
    merchant?: string | null;
    description?: string | null;
    status: TxStatus;
    createdAtUtc: string;
};

export type TransactionFilters = {
    cardId?: string;
    status?: TxStatus;
};

export type FinalizeTransactionInput = {
    newStatus: TxStatus;
};

export type BackendTxHistoryDto = {
    historyId: number;
    transactionId: string;
    oldStatus?: string | null;
    newStatus: string;
    oldAmount?: number | null;
    newAmount: number;
    changedAtUtc: string;
};

export type TxHistory = {
    id: number;
    transactionId: string;
    oldStatus?: string | null;
    newStatus: string;
    oldAmount?: number | null;
    newAmount: number;
    changedAtUtc: string;
};
