import { httpClient } from "./httpClient";
import type { BackendAuthResponse, BackendMeResponse, LoginInput, RegisterInput } from "@models/auth.model";

export const authApi = {
    login: async (input: LoginInput) => {
        const { data } = await httpClient.post<BackendAuthResponse>("/auth/login", input);
        return data;
    },

    register: async (input: RegisterInput) => {
        const { data } = await httpClient.post<BackendAuthResponse>("/auth/register", input);
        return data;
    },

    me: async () => {
        const { data } = await httpClient.get<BackendMeResponse>("/auth/me");
        return data;
    },
};
