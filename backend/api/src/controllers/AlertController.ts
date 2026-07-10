import { Context } from "hono";

import { AlertService } from "../services/alert.service";

const alertService = new AlertService();

export class AlertController {

    async list(
        context: Context,
    ) {

        const userId =
            context.get("user").userId;

        const cameraId =
            context.req.query("cameraId");

        const from =
            context.req.query("from");

        const to =
            context.req.query("to");

        const cursor =
            context.req.query("cursor");

        const limit =
            Number(
                context.req.query("limit") ?? 20,
            );

        const alerts =
            await alertService.list(

                userId,

                {

                    cameraId,

                    from: from
                        ? new Date(from)
                        : undefined,

                    to: to
                        ? new Date(to)
                        : undefined,

                    cursor:
                        cursor ?? undefined,

                    limit,

                },

            );

        return context.json(
            alerts,
        );

    }

}