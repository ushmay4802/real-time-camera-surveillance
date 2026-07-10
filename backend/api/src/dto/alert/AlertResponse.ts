export interface AlertResponse {

    id: string;

    cameraId: string;

    label: string;

    confidence: number;

    box: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;

    createdAt: string;


    cameraName: string;

    location: string;


}

export interface AlertListResponse {

    items: AlertResponse[];

    nextCursor: string | null;

}