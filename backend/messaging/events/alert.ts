export interface AlertEvent {

    cameraId: string;

    label: string;

    confidence: number;

    timestamp: string;

    box: {
        x: number;
        y: number;
        w: number;
        h: number;
    };

}