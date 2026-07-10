import Button from "../../common/Button/Button";
import type { Camera } from "../../../types/camera";

import styles from "./AlertFilterBar.module.css";

export type TimeRangePreset = "1h" | "today" | "24h" | "7d" | "all";

interface AlertFilterBarProps {
    cameras: Camera[];
    selectedCameraId: string;
    selectedRange: TimeRangePreset;
    onCameraChange: (cameraId: string) => void;
    onRangeChange: (range: TimeRangePreset) => void;
    onRefresh: () => void;
}

const AlertFilterBar = ({
    cameras,
    selectedCameraId,
    selectedRange,
    onCameraChange,
    onRangeChange,
    onRefresh,
}: AlertFilterBarProps) => {
    return (
        <div className={styles.container}>
            <select value={selectedCameraId} onChange={(e) => onCameraChange(e.target.value)}>
                <option value="">All Cameras</option>
                {cameras.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                        {camera.name}
                    </option>
                ))}
            </select>

            <select
                value={selectedRange}
                onChange={(e) => onRangeChange(e.target.value as TimeRangePreset)}
            >
                <option value="1h">Last Hour</option>
                <option value="today">Today</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="all">All Time</option>
            </select>

            <Button variant="secondary" onClick={onRefresh}>
                Refresh
            </Button>
        </div>
    );
};

export default AlertFilterBar;
