import WebSocket from "ws";
import type { WebSocketMessage } from "./events";

class Broadcaster {

    private clients =
        new Map<string, Set<WebSocket>>();

    add(userId: string, ws: WebSocket) {

        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Set());
        }

        this.clients.get(userId)!.add(ws);

        console.log(
            `WS connected for ${userId} (${this.clients.get(userId)!.size} sockets)`,
        );

    }

    remove(
        userId: string,
        ws: WebSocket,
    ) {

        const sockets =
            this.clients.get(userId);

        if (!sockets) {
            return;
        }

        sockets.delete(ws);

        if (sockets.size === 0) {
            this.clients.delete(userId);
        }

        console.log(
            `WS clients: ${this.clients.size}`,
        );

    }
    broadcastToUser(
        userId: string,
        message: WebSocketMessage,
    ) {

        const sockets =
            this.clients.get(userId);

        if (!sockets) {
            return;
        }

        const payload =
            JSON.stringify(message);

        for (const socket of sockets) {

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(payload);
            }

        }

    }

}

export const broadcaster = new Broadcaster();