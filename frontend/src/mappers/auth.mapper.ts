import type { AuthTokens, AuthUser, BackendAuthResponse, BackendMeResponse } from "@models/auth.model";

export const mapBackendAuthResponseToTokens = (dto: BackendAuthResponse): AuthTokens => ({
    accessToken: dto.accessToken,
});

export const mapBackendMeToAuthUser = (dto: BackendMeResponse): AuthUser => ({
    id: dto.userId,
    username: dto.username,
    email: dto.email,
});
