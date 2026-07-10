import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";
import Button from "../../components/common/Button/Button";
import Drawer from "../../components/common/Drawer/Drawer";
import CameraForm from "../../components/forms/CameraForm/CameraForm";
import CameraListItem from "../../components/camera/CameraListItem/CameraListItem";
import useCameras from "../../hooks/useCameras";
import type { Camera, CameraInput, CameraUpdateInput } from "../../types/camera";

import styles from "./CameraSettings.module.css";

const CameraSettings = () => {
    const { cameras, isLoading, error, createCamera, updateCamera, removeCamera } = useCameras();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

    const handleAddCamera = () => {
        setSelectedCamera(null);
        setDrawerOpen(true);
    };

    const handleEditCamera = (camera: Camera) => {
        setSelectedCamera(camera);
        setDrawerOpen(true);
    };

    const handleDeleteCamera = async (cameraId: string) => {
        if (!window.confirm("Delete this camera? This cannot be undone.")) return;
        try {
            await removeCamera(cameraId);
        } catch (err) {
            console.error(err);
            window.alert("Failed to delete camera.");
        }
    };

    const handleFormSubmit = async (input: CameraInput | CameraUpdateInput) => {
        if (selectedCamera) {
            await updateCamera(selectedCamera.id, input as CameraUpdateInput);
        } else {
            await createCamera(input as CameraInput);
        }
        setDrawerOpen(false);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1>Camera Management</h1>
                        <p>Create, update and manage RTSP cameras.</p>
                    </div>

                    <Button onClick={handleAddCamera}>Add Camera</Button>
                </div>

                {isLoading && <p>Loading cameras...</p>}
                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <div className={styles.list}>
                    {cameras.map((camera) => (
                        <CameraListItem
                            key={camera.id}
                            camera={camera}
                            onEdit={handleEditCamera}
                            onDelete={handleDeleteCamera}
                        />
                    ))}
                </div>

                <Drawer
                    open={isDrawerOpen}
                    title={selectedCamera ? "Edit Camera" : "Add Camera"}
                    onClose={() => setDrawerOpen(false)}
                >
                    <CameraForm
                        camera={selectedCamera}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setDrawerOpen(false)}
                    />
                </Drawer>
            </div>
        </DashboardLayout>
    );
};

export default CameraSettings;
