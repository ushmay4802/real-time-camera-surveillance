import type { Context, Next } from "hono";
import type { ZodSchema } from "zod";

export const validateBody =
    (schema: ZodSchema) =>
        async (c: Context, next: Next) => {

            const body = await c.req.json();

            const result = schema.safeParse(body);

            if (!result.success) {

                return c.json({

                    message: "Validation failed.",

                    errors: result.error.issues,

                }, 400);

            }

            c.set("validatedBody", result.data);

            await next();

        };