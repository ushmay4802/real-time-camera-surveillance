import { Hono } from "hono";
import { cors } from "hono/cors";
import { upgradeWebSocket } from "@hono/node-server";

import authRoutes from "./routes/auth.routes";
import cameraRoutes from "./routes/camera.routes";
import alertRoutes from "./routes/alert.routes";

const app = new Hono();

app.use(
    "*",
    cors({
        origin: "http://localhost:5173",
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }),
);

app.route("/auth", authRoutes);
app.route("/cameras", cameraRoutes);
app.route("/alerts", alertRoutes);

app.get(
    "/ws",
    upgradeWebSocket(() => {

        return {

            onOpen(event, ws) {

            },

            onClose(event, ws) {

            },

            onMessage(event, ws) {

            },

        };

    }),
);

app.onError((err, c) => {
    console.error(err);

    const message =
        err instanceof Error ? err.message : "Something went wrong.";

    return c.json({ message }, 400);
});

export default app;
