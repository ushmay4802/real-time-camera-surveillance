import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { CameraStatus, defaultRuntime } from "../types/camera";
import type { CameraRuntime } from "../types/camera";
import type { Alert } from "../types/alert";

// Everything the backend pushes goes through one WebSocket connection.
// Keep the wire format identical to what the worker posts to the API,
// per the assignment ("decide the event format once and keep it
// identical across worker, API, DB and WS payload").
type CameraStatusEvent = {
    type: "camera.status";
    cameraId: string;
    status: CameraStatus;
    fps: number;
};

type AlertEvent = {
    type: "alert";
    alert: Alert;
};

type ErrorEvent = {
    type: "error";
    cameraId: string;
    message: string;
};

type WsEvent =
    | CameraStatusEvent
    | AlertEvent
    | ErrorEvent;

const RECONNECT_DELAY_MS = 2000;

const useRealtime = () => {
    const { token, isAuthenticated } = useAuth();
    const [runtimes, setRuntimes] = useState<Record<string, CameraRuntime>>({});
    const [liveAlerts, setLiveAlerts] = useState<Alert[]>([]);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        let cancelled = false;

        const connect = () => {
            const base = import.meta.env.VITE_WS_BASE_URL as string;
            const socket = new WebSocket(`${base}/ws?token=${token}`);
            socketRef.current = socket;

            socket.onmessage = (event) => {
                let payload: WsEvent;
                try {
                    payload = JSON.parse(event.data);
                    console.log("WS:", payload);
                } catch {
                    return;
                }

                if (payload.type === "camera.status") {
                    console.log(
                        "Status Event:",
                        payload.cameraId,
                        payload.status,
                    );
                    setRuntimes((prev) => ({
                        ...prev,
                        [payload.cameraId]: {
                            ...(prev[payload.cameraId] ?? defaultRuntime(payload.cameraId)),
                            status: payload.status,
                            fps: payload.fps,
                            // detectionsPerMin: payload.detectionsPerMin,
                            // boxes: payload.boxes,
                        },
                    }));
                } else if (payload.type === "alert") {
                    setLiveAlerts((prev) => [payload.alert, ...prev].slice(0, 50));
                    setRuntimes((prev) => ({
                        ...prev,
                        [payload.alert.cameraId]: {
                            ...(prev[payload.alert.cameraId] ??
                                defaultRuntime(payload.alert.cameraId)),
                            latestAlertLabel: payload.alert.label,
                        },
                    }));
                } else if (payload.type === "error") {
                    setRuntimes((prev) => ({
                        ...prev,
                        [payload.cameraId]: {
                            ...(prev[payload.cameraId] ?? defaultRuntime(payload.cameraId)),
                            status: CameraStatus.ERROR,
                            error: payload.message,
                        },
                    }));
                }
            };

            socket.onclose = () => {
                if (cancelled) return;
                // Reconnect - a dropped socket shouldn't look like every
                // camera crashed at once, it just means we lost the
                // push channel. UI can grey out "stale" state itself
                // based on last-updated-at if you want to be fancier.
                reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
            };

            socket.onerror = () => {
                socket.close();
            };
        };

        connect();

        return () => {
            cancelled = true;
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            socketRef.current?.close();
        };
    }, [isAuthenticated, token]);

    const getRuntime = (cameraId: string): CameraRuntime =>
        runtimes[cameraId] ?? defaultRuntime(cameraId);

    return { runtimes, getRuntime, liveAlerts };
};

export default useRealtime;
