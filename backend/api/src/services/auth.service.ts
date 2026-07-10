import { container } from "../container/container";

import type {
    RegisterRequest,
    VerifyRegisterOtpRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    RefreshAccessTokenRequest,
} from "../dto/auth/AuthRequest";

import { generateOtp } from "../utils/otp";
import type {
    RegisterOtpData,
    ForgotPasswordOtpData,
} from "../dto/auth/AuthRedis";

export class AuthService {

    private readonly userRepository =
        container.repositories.user;

    private readonly passwordProvider =
        container.providers.password;

    private readonly jwtProvider =
        container.providers.jwt;

    private readonly redisProvider =
        container.providers.redis;

    private readonly mailProvider =
        container.providers.mail;


    async register(request: RegisterRequest) {

        const email = request.email
            .trim()
            .toLowerCase();

        const existingUser =
            await this.userRepository.findByEmail(email);

        if (existingUser) {

            throw new Error("Email already registered.");

        }

        const passwordHash =
            await this.passwordProvider.hash(
                request.password,
            );

        const otp = generateOtp();

        const redisData: RegisterOtpData = {

            name: request.name,

            email,

            passwordHash,

            otp,

        };

        await this.redisProvider.set(

            `register:${email}`,

            redisData,

            300,

        );

        await this.mailProvider.sendMail(

            email,

            "Verify your camera-surveillance-system account",

            `
            <h2>Welcome to camera-surveillance-system</h2>

            <p>Your verification code is:</p>

            <h1>${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>
        `,

        );

        return {

            message:
                "OTP sent successfully.",

        };

    }

    async verifyRegisterOtp(
        request: VerifyRegisterOtpRequest,
    ) {

        const email = request.email
            .trim()
            .toLowerCase();

        const redisData =
            await this.redisProvider.get<RegisterOtpData>(
                `register:${email}`,
            );

        if (!redisData) {

            throw new Error("OTP expired.");

        }

        if (redisData.otp !== request.otp) {

            throw new Error("Invalid OTP.");

        }

        const user =
            await this.userRepository.create({

                name: redisData.name,

                email: redisData.email,

                passwordHash: redisData.passwordHash,

            });

        await this.redisProvider.delete(
            `register:${email}`,
        );

        const payload = {

            userId: user.id,

            email: user.email,

        };

        const accessToken =
            this.jwtProvider.generateAccessToken(payload);

        const refreshToken =
            this.jwtProvider.generateRefreshToken(payload);

        return {

            message: "Registration successful.",

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

            },

            tokens: {

                accessToken,

                refreshToken,

            },

        };

    }

    async login(
        request: LoginRequest,
    ) {

        const email = request.email
            .trim()
            .toLowerCase();

        const user =
            await this.userRepository.findByEmail(email);

        if (!user) {

            throw new Error(
                "Invalid email or password.",
            );

        }

        const passwordValid =
            await this.passwordProvider.compare(
                request.password,
                user.passwordHash,
            );

        if (!passwordValid) {

            throw new Error(
                "Invalid email or password.",
            );

        }

        const payload = {

            userId: user.id,

            email: user.email,

        };

        const accessToken =
            this.jwtProvider.generateAccessToken(payload);

        const refreshToken =
            this.jwtProvider.generateRefreshToken(payload);

        return {

            message: "Login successful.",

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

            },

            tokens: {

                accessToken,

                refreshToken,

            },

        };

    }

    async forgotPassword(
        request: ForgotPasswordRequest,
    ) {

        const email = request.email
            .trim()
            .toLowerCase();

        const user =
            await this.userRepository.findByEmail(
                email,
            );

        if (!user) {

            throw new Error(
                "User not found.",
            );

        }

        const otp = generateOtp();

        const redisData: ForgotPasswordOtpData = {

            email,

            otp,

        };

        await this.redisProvider.set(

            `forgot-password:${email}`,

            redisData,

            300,

        );

        await this.mailProvider.sendMail(

            email,

            "Reset your camera-surveillance-system password",

            `
            <h2>Reset Password</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>
        `,

        );

        return {

            message:
                "OTP sent successfully.",

        };

    }

    async resetPassword(
        request: ResetPasswordRequest,
    ) {

        const email = request.email
            .trim()
            .toLowerCase();

        const redisData =
            await this.redisProvider.get<ForgotPasswordOtpData>(
                `forgot-password:${email}`,
            );

        if (!redisData) {

            throw new Error(
                "OTP expired.",
            );

        }

        if (redisData.otp !== request.otp) {

            throw new Error(
                "Invalid OTP.",
            );

        }

        const user =
            await this.userRepository.findByEmail(
                email,
            );

        if (!user) {

            throw new Error(
                "User not found.",
            );

        }

        const passwordHash =
            await this.passwordProvider.hash(
                request.password,
            );

        await this.userRepository.updatePassword(
            user.id,
            passwordHash,
        );

        await this.redisProvider.delete(
            `forgot-password:${email}`,
        );

        return {

            message:
                "Password reset successfully.",

        };

    }
    async refreshAccessToken(
        request: RefreshAccessTokenRequest,
    ) {

        const payload =
            this.jwtProvider.verifyRefreshToken(
                request.refreshToken,
            );

        const user =
            await this.userRepository.findById(
                payload.userId,
            );

        if (!user) {

            throw new Error(
                "User not found.",
            );

        }

        const accessToken =
            this.jwtProvider.generateAccessToken({

                userId: user.id,

                email: user.email,

            });

        return {

            message:
                "Access token refreshed.",

            accessToken,

        };

    }

}