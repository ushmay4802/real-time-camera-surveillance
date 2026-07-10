import { z } from "zod";

export const registerSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3)
        .max(100),

    email: z
        .email(),

    password: z
        .string()
        .min(8)
        .max(50),

});

export const verifyRegisterOtpSchema = z.object({

    email: z
        .email(),

    otp: z
        .string()
        .length(6),

});

export const loginSchema = z.object({

    email: z
        .email(),

    password: z
        .string(),

});

export const forgotPasswordSchema = z.object({

    email: z
        .email(),

});

export const resetPasswordSchema = z.object({

    email: z
        .email(),

    otp: z
        .string()
        .length(6),

    password: z
        .string()
        .min(8)
        .max(50),

});

export const refreshTokenSchema = z.object({

    refreshToken: z.string(),

});