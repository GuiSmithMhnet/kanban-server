import nodemailer from "nodemailer";

import { env, validateSmtpEnv } from "../config/env.js";

let transporter;
let transporterVerified = false;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.password,
      },
    });
  }

  return transporter;
}

export async function verifyEmailTransport() {
  if (transporterVerified) {
    return;
  }

  validateSmtpEnv();
  await getTransporter().verify();
  transporterVerified = true;
  console.log("[smtp] conexao SMTP validada.");
}

export async function sendEmail({ to, subject, html }) {
  if (!to || !subject || !html) {
    throw new Error("Parametros obrigatorios para envio de e-mail ausentes.");
  }

  await verifyEmailTransport();

  const result = await getTransporter().sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
  });

  console.log(
    `[smtp] e-mail enviado para ${to}. messageId=${result.messageId}`
  );

  return result;
}
