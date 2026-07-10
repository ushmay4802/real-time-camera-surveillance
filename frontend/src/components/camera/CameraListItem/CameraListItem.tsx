import Button from "../../common/Button/Button";

import type { Camera } from "../../../types/camera";

import styles from "./CameraListItem.module.css";

interface CameraListItemProps {
    camera: Camera;
    onEdit: (camera: Camera) => void;
    onDelete: (cameraId: string) => void;
}

const CameraListItem = ({
    camera,
    onEdit,
    onDelete,
}: CameraListItemProps) => {
    return (
        <div className={styles.card}>

            <div className={styles.info}>

                <h3>{camera.name}</h3>

                <p>{camera.location}</p>

                <span>{camera.enabled ? "Enabled" : "Disabled"}</span>

                <small>{camera.rtspUrl}</small>

            </div>

            <div className={styles.actions}>

                <Button
                    variant="secondary"
                    onClick={() => onEdit(camera)}
                >
                    Edit
                </Button>

                <Button
                    variant="danger"
                    onClick={() => onDelete(camera.id)}
                >
                    Delete
                </Button>

            </div>

        </div>
    );
};

export default CameraListItem;