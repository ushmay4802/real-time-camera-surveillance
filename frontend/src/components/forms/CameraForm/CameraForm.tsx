import { useEffect, useState } from "react";

import Button from "../../common/Button/Button";
import Input from "../../common/Input/Input";

import type { Camera, CameraInput, CameraUpdateInput } from "../../../types/camera";

interface CameraFormProps {
    camera: Camera | null;
    onSubmit: (input: CameraInput | CameraUpdateInput) => Promise<void>;
    onCancel: () => void;
}

const CameraForm = ({ camera, onSubmit, onCancel }: CameraFormProps) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [rtspUrl, setRtspUrl] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = camera !== null;

    useEffect(() => {
        if (camera) {
            setName(camera.name);
            setLocation(camera.location);
            setRtspUrl(camera.rtspUrl);
            setEnabled(camera.enabled);
        } else {
            setName("");
            setLocation("");
            setRtspUrl("");
            setEnabled(true);
        }
        setError(null);
    }, [camera]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await onSubmit({ name, location, enabled });
            } else {
                await onSubmit({ name, location, rtspUrl, enabled });
            }
        } catch (err) {
            setError("Could not save camera. Check the details and try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Camera Name" value={name} onChange={setName} required />

            <Input label="Location" value={location} onChange={setLocation} required />

            <Input
                label="RTSP URL"
                value={rtspUrl}
                onChange={setRtspUrl}
                placeholder="rtsp://user:pass@host:554/stream"
                required={!isEditMode}
                disabled={isEditMode}
            />
            {isEditMode && (
                <p style={{ fontSize: 12, color: "var(--text-secondary, #666)", marginTop: -12 }}>
                    RTSP URL can't be changed after a camera is added. Remove and re-add it
                    with the new URL instead.
                </p>
            )}

            <label style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                />
                Enabled
            </label>

            {error && <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>}

            <div style={{ display: "flex", gap: 8 }}>
                <Button type="submit" loading={isSubmitting}>
                    {camera ? "Update Camera" : "Add Camera"}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default CameraForm;
