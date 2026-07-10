import { serve } from "@hono/node-server";

import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./db/database";
import { container } from "./container/container";
import { QUEUES } from "../../messaging/queues/queues";
import { AlertConsumer, CameraStatusConsumer } from "./messaging/messageConsumer";
import { websocketServer } from "./websocket/websocket";
import { WebSocket } from "ws";



await connectDatabase();

await container.rabbitMqProvider.connect(
    env.RABBITMQ_URL,
);
await container.rabbitMqProvider.assertQueue(
    QUEUES.CAMERA_EVENTS,
);

await container.rabbitMqProvider.assertQueue(
    QUEUES.ALERT_EVENTS,
);
await container.rabbitMqProvider.assertQueue(
    QUEUES.CAMERA_STATUS,
);

await new CameraStatusConsumer().start();

await new AlertConsumer().start();

const server = serve({
    fetch: app.fetch,
    port: env.PORT,
});

server.on(
    "upgrade",
    (request, socket, head) => {

        const url = new URL(
            request.url!,
            "http://localhost",
        );

        if (url.pathname !== "/ws") {

            socket.destroy();

            return;

        }

        websocketServer.handleUpgrade(

            request,

            socket,

            head,

            (ws) => {

                websocketServer.emit(
                    "connection",
                    ws,
                    request,
                );

            },

        );

    },
);

console.log(`🚀 API running on port ${env.PORT}`);
