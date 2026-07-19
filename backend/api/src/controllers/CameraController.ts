import { Context } from "hono";

import { CameraService } from "../services/camera.service";

export class CameraController {

    private readonly cameraService =
        new CameraService();

    async create(c: Context) {

        const user = c.get("user");

        const body = c.get("validatedBody");

        const response =
            await this.cameraService.create(
                user.userId,
                body,
            );

        return c.json(response);

    }

    async getAll(c: Context) {

        const user = c.get("user");

        const response =
            await this.cameraService.getAll(
                user.userId,
            );

        return c.json(response);

    }

    async getById(c: Context) {

        const user = c.get("user");

        const cameraId = c.req.param("id")!;

        const response =
            await this.cameraService.getById(
                user.userId,
                cameraId,
            );

        return c.json(response);

    }

    async update(c: Context) {

        const cameraId = c.req.param("id")!;

        const body = c.get("validatedBody");

        const response =
            await this.cameraService.update(
                cameraId,
                body,
            );

        return c.json(response);

    }

    async delete(c: Context) {

        const cameraId = c.req.param("id");

        if (!cameraId) {
            return c.json(
                { message: "Camera ID is required." },
                400,
            );
        }

        const response =
            await this.cameraService.delete(
                cameraId,
            );

        return c.json(response);

    }

    async start(c: Context) {

        const cameraId = c.req.param("id");
        const userId = c.req.param("userId");


        if (!cameraId) {
            return c.json(
                { message: "Camera ID is required." },
                400,
            );
        }

        if (!userId) {
            return c.json(
                { message: "User ID is required." },
                400,
            );
        }

        const result = await this.cameraService.start(cameraId, userId);

        return c.json(result);

    }

    async stop(c: Context) {

        const cameraId = c.req.param("id");
        const userId = c.req.param("userId");
        if (!cameraId) {
            return c.json(
                { message: "Camera ID is required." },
                400,
            );
        }
        if (!userId) {
            return c.json(
                { message: "User ID is required." },
                400,
            );
        }

        const result = await this.cameraService.stop(cameraId, userId);

        return c.json(result);

    }

}