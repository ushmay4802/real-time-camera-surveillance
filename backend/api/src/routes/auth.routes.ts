import { validateBody } from "../middlewares/validation.middleware";
import { AuthController } from "../controllers/AuthController";
import { Hono } from "hono";

import {
    registerSchema,
    verifyRegisterOtpSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema,
} from "../validators/auth.validator";

const auth = new Hono();
const controller = new AuthController();

auth.post(
    "/register",
    validateBody(registerSchema),
    controller.register.bind(controller),
);

auth.post(
    "/verify-register",
    validateBody(verifyRegisterOtpSchema),
    controller.verifyRegisterOtp.bind(controller),
);

auth.post(
    "/login",
    validateBody(loginSchema),
    controller.login.bind(controller),
);

auth.post(
    "/forgot-password",
    validateBody(forgotPasswordSchema),
    controller.forgotPassword.bind(controller),
);

auth.post(
    "/reset-password",
    validateBody(resetPasswordSchema),
    controller.resetPassword.bind(controller),
);

auth.post(
    "/refresh-token",
    validateBody(refreshTokenSchema),
    controller.refreshAccessToken.bind(controller),
);

export default auth;