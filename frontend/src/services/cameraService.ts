import api from "../api/axios";
import type { Camera, CameraInput, CameraUpdateInput } from "../types/camera";

export const listCameras = async (): Promise<Camera[]> => {
    const { data } = await api.get<Camera[]>("/cameras");
    return data;
};

export const createCamera = async (input: CameraInput): Promise<Camera> => {
    const { data } = await api.post<Camera>("/cameras", input);
    return data;
};

export const updateCamera = async (
    id: string,
    input: CameraUpdateInput
): Promise<Camera> => {
    const { data } = await api.put<Camera>(`/cameras/${id}`, input);
    return data;
};

export const deleteCamera = async (id: string): Promise<void> => {
    await api.delete(`/cameras/${id}`);
};

// These just tell the API "please start/stop processing this camera".
// The API forwards the command to the worker over the message
// queue/WS and the *real* status comes back later via the
// realtime "stats" channel - so these calls intentionally do not
// return a final status, only acknowledge the request was queued.
export const startCamera = async (id: string, userId: string | undefined): Promise<void> => {
    await api.patch(`/cameras/${id}/${userId}/start`);
};

export const stopCamera = async (id: string, userId: string | undefined): Promise<void> => {
    await api.patch(`/cameras/${id}/${userId}/stop`);
};
