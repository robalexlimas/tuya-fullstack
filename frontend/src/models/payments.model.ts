export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";
export type TransactionType = "PAYMENT";

export type PaymentFormMode = "PAYMENT";

export type CreatePaymentInput = {
    cardId: string;
    amount: number;
    currency?: string; // USD por defecto backend
    description?: string | null;
};

export type CreatePurchaseInput = {
    cardId: string;
    amount: number;
    currency?: string;
    merchant?: string | null;
    description?: string | null;
    status?: "PENDING" | "COMPLETED";
};

export type CreateRefundInput = {
    cardId: string;
    amount: number;
    currency?: string;
    merchant?: string | null;
    description?: string | null;
};

export type BackendTransactionDto = {
    transactionId: string;
    cardId: string;
    userId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    merchant?: string | null;
    description?: string | null;
    status: TransactionStatus;
    createdAtUtc: string;
};

export type Transaction = {
    id: string;
    cardId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    merchant?: string | null;
    description?: string | null;
    status: TransactionStatus;
    createdAtUtc: string;
};

export type FinalizeTransactionInput = {
    newStatus: TransactionStatus;
};
