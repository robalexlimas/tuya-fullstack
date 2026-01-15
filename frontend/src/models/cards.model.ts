export type CardStatus = "ACTIVE" | "BLOCKED" | "CLOSED";

export type Card = {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    creditLimit: number;
    availableCredit: number;
    status: CardStatus;
    nickname?: string | null;
    createdAtUtc?: string;
};

export type CreateCardInput = {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    creditLimit: number;
    nickname?: string | null;
};

export type UpdateCardInput = {
    brand: string;
    expMonth: number;
    expYear: number;
    nickname?: string | null;
    status: CardStatus;
};

export type BackendCardDto = {
    cardId: string;
    userId: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    creditLimit: number;
    availableCredit: number;
    status: CardStatus;
    nickname?: string | null;
    createdAtUtc?: string;
    updatedAtUtc?: string;
};
