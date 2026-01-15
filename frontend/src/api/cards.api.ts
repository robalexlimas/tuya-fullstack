import { httpClient } from "@api/httpClient";
import type {
    BackendCardDto,
    CreateCardInput,
    UpdateCardInput,
} from "@models/cards.model";

export const cardsApi = {
    list: async () => {
        const { data } = await httpClient.get<BackendCardDto[]>("/cards");
        return data;
    },

    create: async (input: CreateCardInput) => {
        const { data } = await httpClient.post<BackendCardDto>("/cards", input);
        return data;
    },

    update: async (cardId: string, input: UpdateCardInput) => {
        const { data } = await httpClient.put<BackendCardDto>(`/cards/${cardId}`, input);
        return data;
    },

    remove: async (cardId: string) => {
        await httpClient.delete(`/cards/${cardId}`);
    },
};
