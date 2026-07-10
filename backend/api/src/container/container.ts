import { UserRepository } from "../repositories/user.repository";
import { CameraRepository } from "../repositories/camera.repository";
import { UserCameraRepository } from "../repositories/userCamera.repository";
import { AlertRepository } from "../repositories/alert.repository";
import { PasswordProvider } from "../providers/PasswordProvider";
import { JwtProvider } from "../providers/JwtProvider";
import { RedisProvider } from "../providers/RedisProvider";
import { MailProvider } from "../providers/MailProvider";
import { RabbitMqProvider } from "../providers/ RabbitMqProvider";
import { MessagePublisher } from "../messaging/MessagePublisher";

export const container = {
    repositories: {
        user: new UserRepository(),
        camera: new CameraRepository(),
        userCamera: new UserCameraRepository(),
        alert: new AlertRepository(),
    },

    providers: {
        password: new PasswordProvider(),
        jwt: new JwtProvider(),
        redis: new RedisProvider(),
        mail: new MailProvider(),
    },
    rabbitMqProvider: new RabbitMqProvider(),
    messagePublisher: new MessagePublisher(),
};
