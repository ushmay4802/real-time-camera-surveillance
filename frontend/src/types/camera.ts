export const CameraStatus = {
    LIVE: "LIVE",
    STOPPED: "STOPPED",
    CONNECTING: "CONNECTING",
    ERROR: "ERROR",
} as const;

export type CameraStatus = (typeof CameraStatus)[keyof typeof CameraStatus];

export interface Camera {
    id: string;
    name: string;
    location: string;
    rtspUrl: string;
    enabled: boolean;
    cameraId: string;
    streamUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CameraInput {
    name: string;
    location: string;
    rtspUrl: string;
    enabled: boolean;
}

// Matches PUT /cameras/:id (UpdateCameraRequest) - no rtspUrl.
export interface CameraUpdateInput {
    name: string;
    location: string;
    enabled: boolean;
}

// Normalized (0-1) bounding box, so the frontend never has to know the
// source frame resolution. The worker/API should always emit boxes in
// this coordinate space.
export interface BoundingBox {
    x: number; // left, 0-1
    y: number; // top, 0-1
    w: number; // width, 0-1
    h: number; // height, 0-1
    label: string;
    confidence: number;
}

// Live, in-memory runtime state for a camera. This is NOT persisted -
// it is derived entirely from WebSocket "stats" events and resets to
// STOPPED whenever the socket reconnects (see useRealtime).
export interface CameraRuntime {
    cameraId: string;
    status: CameraStatus;
    fps: number;
    detectionsPerMin: number;
    boxes: BoundingBox[];
    latestAlertLabel: string | null;
    error?: string;
}

export const defaultRuntime = (cameraId: string): CameraRuntime => ({
    cameraId,
    status: CameraStatus.STOPPED,
    fps: 0,
    detectionsPerMin: 0,
    boxes: [],
    latestAlertLabel: null,
});
