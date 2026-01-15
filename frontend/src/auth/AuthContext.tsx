import { createContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth.api";
import { TOKEN_STORAGE_KEY } from "../api/httpClient";
import { mapBackendAuthResponseToTokens, mapBackendMeToAuthUser } from "../mappers/auth.mapper";
import type { AuthUser, LoginInput, RegisterInput } from "../models/auth.model";

type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
    };

    const login = async (input: LoginInput) => {
        const dto = await authApi.login(input);
        const tokens = mapBackendAuthResponseToTokens(dto);
        localStorage.setItem(TOKEN_STORAGE_KEY, tokens.accessToken);

        const meDto = await authApi.me();
        setUser(mapBackendMeToAuthUser(meDto));
    };

    const register = async (input: RegisterInput) => {
        const dto = await authApi.register(input);
        const tokens = mapBackendAuthResponseToTokens(dto);
        localStorage.setItem(TOKEN_STORAGE_KEY, tokens.accessToken);

        const meDto = await authApi.me();
        setUser(mapBackendMeToAuthUser(meDto));
    };

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (!token) {
            setIsLoading(false);
            return;
        }

        authApi.me()
            .then((meDto) => setUser(mapBackendMeToAuthUser(meDto)))
            .catch(() => logout())
            .finally(() => setIsLoading(false));
    }, []);

    const value = useMemo(
        () => ({ user, isLoading, login, register, logout }),
        [user, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
