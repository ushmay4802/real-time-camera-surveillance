import { useCallback, useEffect, useState } from "react";

import * as cameraService from "../services/cameraService";
import type { Camera, CameraInput, CameraUpdateInput } from "../types/camera";

const useCameras = () => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await cameraService.listCameras();
            console.log("Fetched cameras:", data);
            setCameras(data);
        } catch (err) {
            setError("Failed to load cameras.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const createCamera = async (input: CameraInput) => {
        const created = await cameraService.createCamera(input);
        console.log("Created camera:", created);
        setCameras((prev) => [...prev, created]);
        return created;
    };

    const updateCamera = async (id: string, input: CameraUpdateInput) => {
        const updated = await cameraService.updateCamera(id, input);
        setCameras((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return updated;
    };

    const removeCamera = async (id: string) => {
        await cameraService.deleteCamera(id);
        setCameras((prev) => prev.filter((c) => c.id !== id));
    };

    const startCamera = async (id: string) => {
        await cameraService.startCamera(id);
        // Actual status transition arrives over the WebSocket
        // ("CONNECTING" -> "LIVE"/"ERROR"), this call just queues it.
    };

    const stopCamera = async (id: string) => {
        await cameraService.stopCamera(id);
    };

    return {
        cameras,
        isLoading,
        error,
        refresh,
        createCamera,
        updateCamera,
        removeCamera,
        startCamera,
        stopCamera,
    };
};

export default useCameras;
