export interface RegisterRequest {

    name: string;

    email: string;

    password: string;

}

export interface VerifyRegisterOtpRequest {

    email: string;

    otp: string;

}

export interface LoginRequest {

    email: string;

    password: string;

}

export interface ForgotPasswordRequest {

    email: string;

}

export interface ResetPasswordRequest {

    email: string;

    otp: string;

    password: string;

}

export interface RefreshAccessTokenRequest {

    refreshToken: string;

}