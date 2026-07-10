export interface RegisterOtpData {

    name: string;

    email: string;

    passwordHash: string;

    otp: string;

}

export interface ForgotPasswordOtpData {

    email: string;

    otp: string;

}