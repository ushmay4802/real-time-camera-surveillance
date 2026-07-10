import { container } from "../container/container";

import { QUEUES } from "../../../messaging/queues/queues";

import type {
    CameraStartEvent,
    CameraStopEvent,
} from "../../../messaging/events/camera";

export class MessagePublisher {

    async publishCameraStarted(
        event: CameraStartEvent,
    ) {

        await container.rabbitMqProvider.publish(
            QUEUES.CAMERA_EVENTS,
            event,
        );

    }

    async publishCameraStopped(
        event: CameraStopEvent,
    ) {

        await container.rabbitMqProvider.publish(
            QUEUES.CAMERA_EVENTS,
            event,
        );

    }

}