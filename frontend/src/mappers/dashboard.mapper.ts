import type { BackendUserSummaryDto, UserSummary } from "@models/dashboard.model";

export const mapBackendSummaryToSummary = (dto: BackendUserSummaryDto): UserSummary => ({
    totalPayments: Number(dto.totalPayments ?? 0),
    totalPurchases: Number(dto.totalPurchases ?? 0),
    totalRefunds: Number(dto.totalRefunds ?? 0),
    totalPaymentsAmount: Number(dto.totalPaymentsAmount ?? 0),
    totalPurchasesAmount: Number(dto.totalPurchasesAmount ?? 0),
    totalRefundsAmount: Number(dto.totalRefundsAmount ?? 0),
});
