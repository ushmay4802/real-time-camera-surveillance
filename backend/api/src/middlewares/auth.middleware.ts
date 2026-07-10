import type { Context, Next } from "hono";

import { container } from "../container/container";

export async function authenticate(
    c: Context,
    next: Next,
) {

    const authorization = c.req.header("Authorization");

    if (
        !authorization ||
        !authorization.startsWith("Bearer ")
    ) {

        return c.json(
            {
                message: "Unauthorized.",
            },
            401,
        );

    }

    const token = authorization.substring(7);

    try {

        const payload =
            container.providers.jwt.verifyAccessToken(
                token,
            );

        c.set("user", payload);

        await next();

    } catch {

        return c.json(
            {
                message: "Invalid token.",
            },
            401,
        );

    }

}