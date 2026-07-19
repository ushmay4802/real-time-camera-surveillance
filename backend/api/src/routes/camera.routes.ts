import { Hono } from "hono";

import { CameraController } from "../controllers/CameraController";

import { authenticate } from "../middlewares/auth.middleware";

import { validateBody } from "../middlewares/validation.middleware";

import {
    createCameraSchema,
    updateCameraSchema,
} from "../validators/camera.validator";

const camera = new Hono();

const controller =
    new CameraController();

camera.use("*", authenticate);

camera.post(
    "/",
    validateBody(createCameraSchema),
    controller.create.bind(controller),
);

camera.get(
    "/",
    controller.getAll.bind(controller),
);

camera.get(
    "/:id",
    controller.getById.bind(controller),
);

camera.put(
    "/:id",
    validateBody(updateCameraSchema),
    controller.update.bind(controller),
);

camera.delete(
    "/:id",
    controller.delete.bind(controller),
);

camera.patch(
    "/:id/:userId/start",
    controller.start.bind(controller),
);

camera.patch(
    "/:id/:userId/stop",
    controller.stop.bind(controller),
);

export default camera;