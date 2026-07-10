import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";
import CameraGrid from "../../components/camera/CameraGrid/CameraGrid";
import useCameras from "../../hooks/useCameras";
import useRealtime from "../../hooks/useRealtime";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const { cameras, isLoading, error, startCamera, stopCamera } = useCameras();
    const { getRuntime } = useRealtime();

    return (
        <DashboardLayout>
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.title}>Camera Dashboard</h1>
                        <p className={styles.subtitle}>
                            Monitor all connected surveillance cameras in real time.
                        </p>
                    </div>
                </div>

                {isLoading && <p>Loading cameras...</p>}
                {error && <p className={styles.error}>{error}</p>}

                {!isLoading && !error && (
                    <CameraGrid
                        cameras={cameras}
                        getRuntime={getRuntime}
                        onStart={startCamera}
                        onStop={stopCamera}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
