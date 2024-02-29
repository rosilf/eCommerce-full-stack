import * as amqp from "amqplib";
import * as dotenv from "dotenv";

dotenv.config();

export class PublisherChannel {
  channel: amqp.Channel;

  async createChannel() {
    const rabbitmqUrl = `amqps://ralhibwc:${process.env.MESSAGE_BROKER_KEY}@sparrow.rmq.cloudamqp.com/ralhibwc`;
    const connection = await amqp.connect(
      rabbitmqUrl
    );
    this.channel = await connection.createChannel();
  }

  async sendEvent(msg: string) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchange = "signup_exchange";

    // create the exchange if it doesn't exist
    await this.channel.assertExchange(exchange, "fanout", { durable: true });

    // publish the message to the exchange
    await this.channel.publish(exchange, "", Buffer.from(msg));
    console.log(
      `Publisher >>> | message "${msg}" published to exchange "${exchange}"`
    );
  }
}