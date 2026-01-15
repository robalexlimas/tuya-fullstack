import type { BackendCardDto, Card } from "@models/cards.model";

export const mapBackendCardToCard = (dto: BackendCardDto): Card => ({
    id: dto.cardId,
    brand: dto.brand,
    last4: dto.last4,
    expMonth: dto.expMonth,
    expYear: dto.expYear,
    creditLimit: Number(dto.creditLimit),
    availableCredit: Number(dto.availableCredit),
    status: dto.status,
    nickname: dto.nickname ?? null,
    createdAtUtc: dto.createdAtUtc,
});
