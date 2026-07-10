export const CAMERA_ACTIONS = {
    START: "start",
    STOP: "stop",
} as const;

export const CAMERA_STATUSES = {
    LIVE: "live",
    STOPPED: "stopped",
    CONNECTING: "connecting",
    ERROR: "error",
} as const;

export type CameraStatus =
    (typeof CAMERA_STATUSES)[keyof typeof CAMERA_STATUSES];

export interface CameraStartEvent {
    action: typeof CAMERA_ACTIONS.START;
    cameraId: string;
    rtspUrl: string;
}

export interface CameraStopEvent {
    action: typeof CAMERA_ACTIONS.STOP;
    cameraId: string;
}

export interface CameraStatusEvent {
    cameraId: string;
    status: CameraStatus;
    fps: number;
}

export type CameraEvent =
    | CameraStartEvent
    | CameraStopEvent
    | CameraStatusEvent;