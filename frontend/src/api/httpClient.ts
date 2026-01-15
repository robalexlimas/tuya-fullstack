import axios from "axios";
import { env } from "../config/env";

export const TOKEN_STORAGE_KEY = "token";

export const httpClient = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

httpClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        return Promise.reject(error);
    }
);
