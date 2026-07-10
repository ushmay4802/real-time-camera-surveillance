import { WebSocketServer } from "ws";

import { broadcaster } from "./broadcaster";
import { container } from "../container/container";

export const websocketServer = new WebSocketServer({
    noServer: true,
});

websocketServer.on(
    "connection",
    (socket, request) => {

        const url = new URL(
            request.url!,
            "http://localhost",
        );

        const token =
            url.searchParams.get("token");

        if (!token) {
            socket.close();
            return;
        }

        let payload;

        try {

            payload =
                container.providers.jwt.verifyAccessToken(
                    token,
                );

        } catch {

            socket.close();

            return;
        }

        const userId = payload.userId;

        console.log(
            `WS connected (${userId})`,
        );

        broadcaster.add(
            userId,
            socket,
        );

        socket.on(
            "close",
            () => {

                broadcaster.remove(
                    userId,
                    socket,
                );

                console.log(
                    `WS disconnected (${userId})`,
                );

            },
        );

        socket.on(
            "error",
            console.error,
        );

    },
);