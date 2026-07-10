import { Context } from "hono";

import { AuthService } from "../services/auth.service";

export class AuthController {

    private readonly authService =
        new AuthService();

    async register(c: Context) {

        const body = c.get("validatedBody");

        const response =
            await this.authService.register(body);

        return c.json(response);

    }

    async verifyRegisterOtp(c: Context) {

        const body = c.get("validatedBody");

        const response =
            await this.authService.verifyRegisterOtp(body);

        return c.json(response);

    }

    async login(c: Context) {

        const body = c.get("validatedBody");

        const response =
            await this.authService.login(body);

        return c.json(response);

    }

    async forgotPassword(c: Context) {

        const body = c.get("validatedBody");

        const response =
            await this.authService.forgotPassword(body);

        return c.json(response);

    }

    async resetPassword(c: Context) {

        const body = c.get("validatedBody");

        const response =
            await this.authService.resetPassword(body);

        return c.json(response);

    }

    async refreshAccessToken(c: Context) {

        const body = c.get("validatedBody");

        const response =
            await this.authService.refreshAccessToken(body);

        return c.json(response);

    }

}