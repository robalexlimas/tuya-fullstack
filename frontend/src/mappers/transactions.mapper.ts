import type {
    BackendTransactionDto,
    Transaction,
    BackendTxHistoryDto,
    TxHistory,
} from "@models/transactions.model";

export const mapBackendTxToTx = (dto: BackendTransactionDto): Transaction => ({
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

export const mapBackendTxHistoryToTxHistory = (
    dto: BackendTxHistoryDto
): TxHistory => ({
    id: dto.historyId,
    transactionId: dto.transactionId,
    oldStatus: dto.oldStatus ?? null,
    newStatus: dto.newStatus,
    oldAmount: dto.oldAmount ?? null,
    newAmount: Number(dto.newAmount),
    changedAtUtc: dto.changedAtUtc,
});
