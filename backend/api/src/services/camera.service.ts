import { container } from "../container/container";
import type { CreateCameraRequest, UpdateCameraRequest } from "../dto/camera/CameraRequest";
import { env } from "../config/env";
import { CAMERA_ACTIONS } from "../../../messaging/events/camera";

export class CameraService {

    private readonly cameraRepository =
        container.repositories.camera;

    private readonly userCameraRepository =
        container.repositories.userCamera;


    async create(
        userId: string,
        request: CreateCameraRequest,
    ) {

        let camera =
            await this.cameraRepository.findByRtspUrl(
                request.rtspUrl,
            );

        if (!camera) {

            camera =
                await this.cameraRepository.create({

                    rtspUrl: request.rtspUrl,

                });

        }

        const existingAssignment =
            await this.userCameraRepository.findByUserAndCamera(
                userId,
                camera.id,
            );

        if (existingAssignment) {

            throw new Error(
                "Camera already added.",
            );

        }

        const userCamera =
            await this.userCameraRepository.create({

                name: request.name,

                location: request.location,

                enabled: true,

                user: {
                    connect: {
                        id: userId,
                    },
                },

                camera: {
                    connect: {
                        id: camera.id,
                    },
                },

            });

        /*
            Next Step:
            Publish "camera.add"
            to RabbitMQ
        */


        return {

            id: userCamera.id,

            name: userCamera.name,

            location: userCamera.location,

            enabled: userCamera.enabled,

            cameraId: camera.id,

            rtspUrl: camera.rtspUrl,

            streamUrl: `${env.MEDIAMTX_WEBRTC}/${camera.id}/whep`,

        };

    }

    async getAll(userId: string) {

        const cameras =
            await this.userCameraRepository.findByUserId(
                userId,
            );

        return cameras.map((camera) => ({

            id: camera.id,

            name: camera.name,

            location: camera.location,

            enabled: camera.enabled,

            rtspUrl: camera.camera.rtspUrl,

            cameraId: camera.camera.id,

            streamUrl:
                `${env.MEDIAMTX_WEBRTC}/${camera.camera.id}/whep`,

        }));

    }

    async getById(
        userId: string,
        cameraId: string,
    ) {

        const camera =
            await this.userCameraRepository.findByUserAndCamera(
                userId,
                cameraId,
            );

        if (!camera) {

            throw new Error(
                "Camera not found.",
            );

        }

        return {

            id: camera.id,

            name: camera.name,

            location: camera.location,

            enabled: camera.enabled,

            rtspUrl: camera.camera.rtspUrl,

            streamUrl:
                `${env.MEDIAMTX_WEBRTC}/${camera.camera.id}`,

        };

    }

    async update(
        userCameraId: string,
        request: UpdateCameraRequest,
    ) {

        return this.userCameraRepository.update(
            userCameraId,
            {

                name: request.name,

                location: request.location,

                enabled: request.enabled,

            },
        );

    }

    async delete(
        userCameraId: string,
    ) {

        await this.userCameraRepository.delete(
            userCameraId,
        );

        /*
            Next Step:
            Publish "camera.remove"
            to RabbitMQ
        */

        return {

            message: "Camera removed successfully.",

        };

    }

    async start(cameraId: string, userId: string) {

        const camera =
            await this.cameraRepository.findById(cameraId);

        if (!camera) {
            throw new Error("Camera not found");
        }

        await container.messagePublisher.publishCameraStarted({

            action: CAMERA_ACTIONS.START,

            cameraId: camera.id,

            rtspUrl: camera.rtspUrl,

            userId: userId,

        });

        return {
            message: "Camera start requested.",
        };

    }

    async stop(cameraId: string, userId: string) {

        const camera =
            await this.cameraRepository.findById(cameraId);

        if (!camera) {
            throw new Error("Camera not found");
        }

        await container.messagePublisher.publishCameraStopped({

            action: CAMERA_ACTIONS.STOP,

            cameraId: camera.id,

            userId: userId,

        });

        return {
            message: "Camera stop requested.",
        };

    }

}
