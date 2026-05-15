import amqp from "amqplib";

import { EMAIL_QUEUE_NAME, env } from "../config/env.js";

export async function connectRabbitMQ() {
  const connection = await amqp.connect(env.rabbitmq.url);
  const channel = await connection.createChannel();

  await channel.assertQueue(EMAIL_QUEUE_NAME, { durable: true });
  await channel.prefetch(1);

  console.log("[rabbitmq] conectado ao RabbitMQ.");
  console.log(`[rabbitmq] fila declarada: ${EMAIL_QUEUE_NAME}.`);

  return { connection, channel };
}
