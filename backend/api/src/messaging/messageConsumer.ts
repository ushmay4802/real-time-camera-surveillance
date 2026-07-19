import { container } from "../container/container";

import { QUEUES } from "../../../messaging/queues/queues";

import { broadcaster } from "../websocket/broadcaster";
import { WS_EVENTS } from "../websocket/events";

import { StatusService } from "../services/status.service";
import { AlertService } from "../services/alert.service";

const statusService = new StatusService();
const alertService = new AlertService();

export class CameraStatusConsumer {

    async start() {

        await container.rabbitMqProvider.consume(
            QUEUES.CAMERA_STATUS,
            async (message) => {

                const event = JSON.parse(
                    message.content.toString(),
                );


                // const users =
                //     await statusService.publishStatus(
                //         event,
                //     );

                // for (const user of users) {

                broadcaster.broadcastToUser(
                    event.userId,
                    {
                        type: WS_EVENTS.CAMERA_STATUS,
                        cameraId: event.cameraId,
                        status: event.status,
                        fps: event.fps,
                        userId: event.userId,
                    },
                );

                // }

            },

        );

    }

}

export class AlertConsumer {

    async start() {

        await container.rabbitMqProvider.consume(

            QUEUES.ALERT_EVENTS,

            async (message) => {

                const event = JSON.parse(
                    message.content.toString(),
                );

                const users =
                    await alertService.create(
                        event,
                    );

                for (const user of users) {

                    broadcaster.broadcastToUser(
                        user.userId,
                        {
                            type: WS_EVENTS.ALERT,
                            alert: event,
                        },
                    );

                }

            },

        );

    }

}
