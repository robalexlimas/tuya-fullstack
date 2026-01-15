export type AuthUser = {
    id: string;
    username: string;
    email: string;
};

export type AuthTokens = {
    accessToken: string;
};

export type LoginInput = {
    username: string;
    password: string;
};

export type RegisterInput = {
    username: string;
    email: string;
    password: string;
};

export type BackendMeResponse = {
    userId: string;
    username: string;
    email: string;
};

export type BackendAuthResponse = {
    accessToken: string;
};
