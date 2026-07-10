import { Hono } from "hono";

import { AlertController } from "../controllers/AlertController";
import { authenticate } from "../middlewares/auth.middleware";

const routes = new Hono();

const controller =
    new AlertController();

routes.use("*", authenticate);

routes.get(
    "/",
    controller.list.bind(controller),
);

export default routes;