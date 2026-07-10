export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}


export interface AuthResponse {
    message: string;
    user: User;
    tokens: AuthTokens;
}


export interface MessageResponse {
    message: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface VerifyRegisterOtpPayload {
    email: string;
    otp: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    otp: string;
    password: string;
}
