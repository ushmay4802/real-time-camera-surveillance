import type { Alert } from "../../../types/alert";

import styles from "./AlertListItem.module.css";

interface Props {
    alert: Alert;
}

const AlertListItem = ({ alert }: Props) => {
    return (
        <div className={styles.row}>
            <span>{new Date(alert.createdAt).toLocaleString()}</span>
            <span>{alert.cameraName}</span>
            <span>{alert.location}</span>
            <span>
                {alert.label} ({(alert.confidence * 100).toFixed(0)}%)
            </span>
        </div>
    );
};

export default AlertListItem;
