export interface CreateCameraRequest {

    name: string;

    location: string;

    rtspUrl: string;

}

export interface UpdateCameraRequest {

    name: string;

    location: string;

    enabled: boolean;

}