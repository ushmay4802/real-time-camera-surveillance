import { useEffect, useRef } from "react";

import { CameraStatus } from "../../../types/camera";
import type {
    BoundingBox,
    CameraStatus as CameraStatusType,
} from "../../../types/camera";

import styles from "./CameraPlayer.module.css";

interface CameraPlayerProps {
    cameraId: string;
    streamUrl: string;
    status: CameraStatusType;
    boxes: BoundingBox[];
    connect: boolean;
}

const negotiate = async (
    streamUrl: string,
    pc: RTCPeerConnection,
): Promise<void> => {

    console.log("Negotiating:", streamUrl);

    pc.addTransceiver("video", {
        direction: "recvonly",
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === "complete") {
            resolve();
            return;
        }

        const listener = () => {
            if (pc.iceGatheringState === "complete") {
                pc.removeEventListener(
                    "icegatheringstatechange",
                    listener,
                );
                resolve();
            }
        };

        pc.addEventListener(
            "icegatheringstatechange",
            listener,
        );
    });

    const response = await fetch(streamUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/sdp",
        },
        body: pc.localDescription!.sdp,
    });

    if (!response.ok) {
        throw new Error(
            `WebRTC negotiation failed (${response.status})`,
        );
    }

    const answer = await response.text();

    await pc.setRemoteDescription({
        type: "answer",
        sdp: answer,
    });
};

const CameraPlayer = ({
    cameraId,
    streamUrl,
    status,
    boxes,
    connect,
}: CameraPlayerProps) => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);

    console.log("CameraPlayer render", {
        cameraId,
        status,
        connect,
    });

    useEffect(() => {
        console.log("Effect started");
        if (!connect) {

            pcRef.current?.close();
            pcRef.current = null;

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            return;
        }

        console.log("Effect started", {
            cameraId,
            connect,
            streamUrl,
        });

        let cancelled = false;
        let pc: RTCPeerConnection | null = null;

        const timer = setTimeout(async () => {

            if (cancelled) return;

            pc = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302",
                    },
                ],
            });

            pcRef.current = pc;

            pc.onconnectionstatechange = () => {
                console.log(
                    "Connection:",
                    pc!.connectionState,
                );
            };

            pc.oniceconnectionstatechange = () => {
                console.log(
                    "ICE:",
                    pc!.iceConnectionState,
                );
            };

            pc.ontrack = (event) => {

                console.log("Track received");

                if (!videoRef.current) return;

                videoRef.current.srcObject = event.streams[0];

                videoRef.current
                    .play()
                    .catch(console.error);
            };

            try {
                await negotiate(
                    streamUrl,
                    pc,
                );
            } catch (err) {
                console.error(err);
            }

        }, 2000);

        return () => {

            cancelled = true;

            clearTimeout(timer);

            pc?.close();

            if (pcRef.current === pc) {
                pcRef.current = null;
            }
            console.log("Effect cleanup");



        };

    }, [cameraId, streamUrl, connect]);

    useEffect(() => {

        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;

        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height,
        );

        boxes.forEach((box) => {

            const x = box.x * canvas.width;
            const y = box.y * canvas.height;
            const w = box.w * canvas.width;
            const h = box.h * canvas.height;

            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);

            const label = `${box.label} ${(box.confidence * 100).toFixed(0)}%`;

            ctx.font = "12px Inter";

            const textWidth = ctx.measureText(label).width;

            ctx.fillStyle = "#22c55e";
            ctx.fillRect(
                x,
                Math.max(0, y - 16),
                textWidth + 8,
                16,
            );

            ctx.fillStyle = "#0b1120";
            ctx.fillText(
                label,
                x + 4,
                Math.max(12, y - 4),
            );
        });

    }, [boxes]);

    return (
        <div className={styles.player}>
            <video
                ref={videoRef}
                className={styles.video}
                autoPlay
                muted
                playsInline
            />

            <canvas
                ref={canvasRef}
                className={styles.overlay}
            />

            {status !== CameraStatus.LIVE && (
                <div className={styles.placeholder}>
                    {status === CameraStatus.CONNECTING && (
                        <>
                            <div className={styles.spinner} />
                            <span>
                                Connecting...
                            </span>
                        </>
                    )}

                    {status === CameraStatus.STOPPED && (
                        <span>
                            Stream stopped
                        </span>
                    )}

                    {status === CameraStatus.ERROR && (
                        <span>
                            Stream error
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default CameraPlayer;