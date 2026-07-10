import amqp from "amqplib";
import type {
    ChannelModel,
    Channel,
    ConsumeMessage,
} from "amqplib";

export class RabbitMqProvider {

    private connection?: ChannelModel;

    private channel?: Channel;

    async connect(url: string) {

        this.connection = await amqp.connect(url);

        this.channel = await this.connection.createChannel();

        console.log("✅ RabbitMQ Connected");
    }

    async disconnect() {

        await this.channel?.close();
        await this.connection?.close();

    }
    async assertQueue(
        queue: string,
    ) {

        await this.channel!.assertQueue(
            queue,
            {
                durable: true,
            },
        );

    }

    async publish(
        queue: string,
        message: unknown,
    ) {

        this.channel!.sendToQueue(

            queue,

            Buffer.from(
                JSON.stringify(message),
            ),

            {
                persistent: true,
            },

        );

    }

    async consume(

        queue: string,

        handler: (
            message: ConsumeMessage,
        ) => Promise<void>,

    ) {

        await this.channel!.consume(

            queue,

            async (message) => {

                if (!message) {
                    return;
                }

                try {

                    await handler(message);

                    this.channel!.ack(message);

                } catch (error) {

                    console.error(error);

                    this.channel!.nack(
                        message,
                        false,
                        true,
                    );

                }

            },

        );

    }

}