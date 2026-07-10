import { container } from "../container/container";


import type { CameraStatusEvent } from "../../../messaging/events/camera";

export class StatusService {

    private readonly userCameraRepository =
        container.repositories.userCamera;

    async publishStatus(
        event: CameraStatusEvent,
    ) {

        const users =
            await this.userCameraRepository.findByCameraId(
                event.cameraId,
            );

        return users;


    }

}