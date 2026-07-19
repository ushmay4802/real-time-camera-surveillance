import type { AlertEvent as WorkerAlertEvent } from "../../../messaging/events/alert";
import type { CameraStatus } from "../../../messaging/events/camera";

export const WS_EVENTS = {

    CAMERA_STATUS: "camera.status",

    ALERT: "alert",

} as const;

export interface CameraStatusMessage {

    type: typeof WS_EVENTS.CAMERA_STATUS;

    cameraId: string;

    status: CameraStatus;

    fps: number;

    userId: string;

}

export interface AlertMessage {

    type: typeof WS_EVENTS.ALERT;

    alert: WorkerAlertEvent;

}

export type WebSocketMessage =
    | CameraStatusMessage
    | AlertMessage;