export interface AuthTokens {

    accessToken: string;

    refreshToken: string;

}

export interface AuthUser {

    id: string;

    name: string;

    email: string;

}

export interface AuthResponse {

    message: string;

    user?: AuthUser;

    tokens?: AuthTokens;

}