import type { BackendTransactionDto, Transaction } from "@models/payments.model";

export const mapBackendTransactionToTransaction = (
    dto: BackendTransactionDto
): Transaction => ({
    id: dto.transactionId,
    cardId: dto.cardId,
    type: dto.type,
    amount: Number(dto.amount),
    currency: dto.currency,
    merchant: dto.merchant ?? null,
    description: dto.description ?? null,
    status: dto.status,
    createdAtUtc: dto.createdAtUtc,
});
