import { EMAIL_QUEUE_NAME, env } from "../config/env.js";
import { createEmailLog } from "../repositories/emailLogRepository.js";
import { sendEmail } from "../services/emailService.js";
import { connectRabbitMQ } from "../services/rabbitmqService.js";

import summarizeError from '../utils/summarizeError.js';
import parseMessageContent from "../utils/parseMessageContent.js";
import isNonEmptyString from '../utils/isNonEmptyString.js';

function hasMinimumFieldsForLog(payload) {
  return (
    Number.isInteger(payload?.id_usuario) &&
    isNonEmptyString(payload?.email) &&
    isNonEmptyString(payload?.assunto) &&
    isNonEmptyString(payload?.corpo)
  );
}

function validatePayload(payload) {
  const missingFields = [];

  if (!Number.isInteger(payload?.id_usuario)) {
    missingFields.push("id_usuario");
  }

  if (!isNonEmptyString(payload?.email)) {
    missingFields.push("email");
  }

  if (!isNonEmptyString(payload?.assunto)) {
    missingFields.push("assunto");
  }

  if (!isNonEmptyString(payload?.corpo)) {
    missingFields.push("corpo");
  }

  if (!Number.isInteger(payload?.id_convite)) {
    missingFields.push("id_convite");
  }

  if (missingFields.length > 0) {
    throw new Error(`Payload invalido. Campos obrigatorios: ${missingFields.join(", ")}`);
  }

  return {
    id_usuario: payload.id_usuario,
    email: payload.email.trim(),
    assunto: payload.assunto.trim(),
    corpo: payload.corpo,
    id_convite: payload.id_convite,
  };
}

async function safeCreateEmailLog(data) {
  try {
    const emailLog = await createEmailLog(data);
    console.log(
      `[email-consumer] log criado. id_convite=${emailLog.id_convite} id_usuario=${emailLog.id_usuario} email=${emailLog.email}`
    );
  } catch (error) {
    console.error(
      "[email-consumer] erro ao criar email_log:",
      summarizeError(error)
    );
  }
}

async function handleMessage(message, channel) {
  const content = parseMessageContent(message);

  let payload;

  try {
    payload = JSON.parse(content);
  } catch (error) {
    console.error("[email-consumer] erro no parse do JSON:", summarizeError(error));
    channel.ack(message);
    return;
  }

  let validPayload;

  try {
    validPayload = validatePayload(payload);
  } catch (error) {
    const summarizedError = summarizeError(error);

    console.error("[email-consumer] erro no payload:", summarizedError);

    if (hasMinimumFieldsForLog(payload)) {
      await safeCreateEmailLog({
        id_usuario: payload.id_usuario,
        email: payload.email.trim(),
        assunto: payload.assunto.trim(),
        corpo: payload.corpo,
        id_convite: Number.isInteger(payload.id_convite) ? payload.id_convite : null,
        erro: summarizedError,
      });
    }

    channel.ack(message);
    return;
  }

  console.log(
    `[email-consumer] mensagem recebida. id_convite=${validPayload.id_convite} id_usuario=${validPayload.id_usuario} email=${validPayload.email} assunto=${validPayload.assunto}`
  );

  try {
    await sendEmail({
      to: validPayload.email,
      subject: validPayload.assunto,
      html: validPayload.corpo,
    });

    console.log(
      `[email-consumer] envio concluido. id_convite=${validPayload.id_convite} id_usuario=${validPayload.id_usuario}`
    );

    await safeCreateEmailLog({
      ...validPayload,
      erro: null,
    });
  } catch (error) {
    const summarizedError = summarizeError(error);

    console.error(
      `[email-consumer] erro no envio. id_convite=${validPayload.id_convite} id_usuario=${validPayload.id_usuario} email=${validPayload.email}: ${summarizedError}`
    );

    await safeCreateEmailLog({
      ...validPayload,
      erro: summarizedError,
    });
  }

  channel.ack(message);
}

export async function startEmailConsumer() {
  const { channel, connection } = await connectRabbitMQ();

  connection.on("error", (error) => {
    console.error("[rabbitmq] erro na conexao:", summarizeError(error));
  });

  connection.on("close", () => {
    console.error("[rabbitmq] conexao encerrada.");
  });

  await channel.consume(EMAIL_QUEUE_NAME, async (message) => {
    if (!message) {
      return;
    }

    try {
      await handleMessage(message, channel);
    } catch (error) {
      console.error(
        "[email-consumer] erro inesperado no processamento:",
        summarizeError(error)
      );
      channel.ack(message);
    }
  });

  console.log(
    `[email-consumer] aguardando mensagens na fila ${EMAIL_QUEUE_NAME}.`
  );
}
