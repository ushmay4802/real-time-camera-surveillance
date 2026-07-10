import api from "../api/axios";
import type {
    AuthResponse,
    ForgotPasswordPayload,
    LoginPayload,
    MessageResponse,
    RegisterPayload,
    ResetPasswordPayload,
    VerifyRegisterOtpPayload,
} from "../types/auth";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
};

export const register = async (payload: RegisterPayload): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/register", payload);
    return data;
};

export const verifyRegisterOtp = async (
    payload: VerifyRegisterOtpPayload
): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/verify-register", payload);
    return data;
};

export const forgotPassword = async (
    payload: ForgotPasswordPayload
): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/forgot-password", payload);
    return data;
};

export const resetPassword = async (
    payload: ResetPasswordPayload
): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/reset-password", payload);
    return data;
};
