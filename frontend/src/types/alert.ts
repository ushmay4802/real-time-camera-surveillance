import type { BoundingBox } from "./camera";

export interface Alert {
    id: string;
    cameraId: string;
    label: string;
    confidence: number;
    createdAt: string;
    box?: BoundingBox;
    cameraName: string;

    location: string;
}

export interface AlertFilters {

    cameraId?: string;

    from?: string;

    to?: string;

    cursor?: string;

    limit?: number;


}

export interface AlertPage {

    items: Alert[];

    nextCursor: string | null;

}
