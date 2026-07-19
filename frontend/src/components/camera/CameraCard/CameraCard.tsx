import { useState } from "react";

import Button from "../../common/Button/Button";
import CameraPlayer from "../CameraPlayer/CameraPlayer";

import { CameraStatus } from "../../../types/camera";
import type { Camera, CameraRuntime } from "../../../types/camera";
import { getErrorMessage } from "../../../api/axios";
import styles from "./CameraCard.module.css";
import { useAuth } from "../../../context/AuthContext";


interface CameraCardProps {
    camera: Camera;
    runtime: CameraRuntime;
    onStart: (id: string, userId: string | undefined) => Promise<void>;
    onStop: (id: string, userId: string | undefined) => Promise<void>;
}


const CameraCard = ({ camera, runtime, onStart, onStop }: CameraCardProps) => {
    const [pending, setPending] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const { user } = useAuth();


    const isBusy =
        runtime.status === CameraStatus.CONNECTING;

    const isLive =
        runtime.status === CameraStatus.LIVE;


    const handleStart = async () => {
        setPending(true);
        setActionError(null);
        try {
            await onStart(camera.cameraId, user?.id);
        } catch (err) {
            setActionError(getErrorMessage(err, "Could not start camera - worker not connected yet."));
            console.error(err);
        } finally {
            setPending(false);
        }
    };

    const handleStop = async () => {
        setPending(true);
        setActionError(null);
        try {
            await onStop(camera.cameraId, user?.id);
        } catch (err) {
            setActionError(getErrorMessage(err, "Could not stop camera - worker not connected yet."));
            console.error(err);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3>{camera.name}</h3>
                    <p>{camera.location}</p>
                </div>
                <span className={`${styles.status} ${styles[runtime.status]}`}>
                    {runtime.status}
                </span>
            </div>

            <CameraPlayer
                cameraId={camera.cameraId}
                streamUrl={camera.streamUrl}
                status={runtime.status}
                boxes={runtime.boxes}
                connect={isLive}
            />

            <div className={styles.info}>
                <span>FPS</span>
                <strong>{runtime.fps}</strong>
            </div>

            <div className={styles.info}>
                <span>Detections / min</span>
                <strong>{runtime.detectionsPerMin}</strong>
            </div>

            <div className={styles.info}>
                <span>Latest Alert</span>
                <strong>{runtime.latestAlertLabel ?? "No alerts yet"}</strong>
            </div>

            {runtime.status === CameraStatus.ERROR && runtime.error && (
                <p className={styles.errorText}>{runtime.error}</p>
            )}

            {actionError && <p className={styles.errorText}>{actionError}</p>}

            <div className={styles.actions}>
                <Button onClick={handleStart} disabled={pending || isBusy || isLive}>
                    Start
                </Button>
                <Button variant="danger" onClick={handleStop} disabled={pending || (!isBusy && !isLive)}>
                    Stop
                </Button>
            </div>
        </div >
    );
};

export default CameraCard;
