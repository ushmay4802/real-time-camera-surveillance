import { container } from "../container/container";

import type { AlertEvent } from "../../../messaging/events/alert";
import type { AlertQuery } from "../repositories/alert.repository";

export class AlertService {

    private readonly alertRepository =
        container.repositories.alert;

    private readonly userCameraRepository =
        container.repositories.userCamera;

    async create(
        event: AlertEvent,
    ) {

        const users =
            await this.userCameraRepository.findByCameraId(
                event.cameraId,
            );

        if (users.length === 0) {
            throw new Error(
                "Camera not assigned.",
            );
        }

        await this.alertRepository.createMany(

            users.map((user: any) => ({

                userId: user.userId,

                cameraId: event.cameraId,

                label: event.label,

                confidence: event.confidence,

                box: event.box,

                createdAt: new Date(
                    event.timestamp,
                ),

            })),

        );

        return users;

    }

    async list(
        userId: string,
        filters: AlertQuery,
    ) {

        return this.alertRepository.findAll(
            userId,
            filters,
        );

    }

}