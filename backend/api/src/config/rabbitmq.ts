import amqp from "amqplib";

import { env } from "./env";

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export async function getChannel(): Promise<amqp.Channel> {

    if (channel) {
        return channel;
    }

    connection = await amqp.connect(env.RABBITMQ_URL);

    channel = await connection.createChannel();

    return channel;

}

export async function closeRabbitMQ(): Promise<void> {

    await channel?.close();

    await connection?.close();

    channel = null;
    connection = null;

}