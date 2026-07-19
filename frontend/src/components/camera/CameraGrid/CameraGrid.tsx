import CameraCard from "../CameraCard/CameraCard";

import { defaultRuntime } from "../../../types/camera";
import type { Camera, CameraRuntime } from "../../../types/camera";

import styles from "./CameraGrid.module.css";

interface CameraGridProps {
    cameras: Camera[];
    getRuntime: (cameraId: string) => CameraRuntime;
    onStart: (id: string, userId: string | undefined) => Promise<void>;
    onStop: (id: string, userId: string | undefined) => Promise<void>;
}

const CameraGrid = ({ cameras, getRuntime, onStart, onStop }: CameraGridProps) => {
    if (cameras.length === 0) {
        return <p>No cameras yet. Add one from Camera Settings.</p>;
    }

    return (
        <div className={styles.grid}>
            {cameras.map((camera) => (
                <CameraCard
                    key={camera.id}
                    camera={camera}
                    runtime={getRuntime(camera.cameraId) ?? defaultRuntime(camera.cameraId)}
                    onStart={onStart}
                    onStop={onStop}
                />
            ))}
        </div>
    );
};

export default CameraGrid;
