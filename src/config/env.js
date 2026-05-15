import "dotenv/config";

const requiredStartupVars = [
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "POSTGRES_DB",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "RABBITMQ_URL",
];

const requiredSmtpVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
];

function parseNumber(value, variableName) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Variavel de ambiente invalida: ${variableName}`);
  }

  return parsedValue;
}

function parseBoolean(value) {
  return String(value).toLowerCase() === "true";
}

function collectMissingVars(variableNames) {
  return variableNames.filter((variableName) => {
    const value = process.env[variableName];
    return value === undefined || value === null || value === "";
  });
}

export function validateStartupEnv() {
  const missingVars = collectMissingVars(requiredStartupVars);

  if (missingVars.length > 0) {
    throw new Error(
      `Variaveis de ambiente obrigatorias ausentes: ${missingVars.join(", ")}`
    );
  }
}

export function validateSmtpEnv() {
  const missingVars = collectMissingVars(requiredSmtpVars);

  if (missingVars.length > 0) {
    throw new Error(
      `Variaveis SMTP obrigatorias ausentes: ${missingVars.join(", ")}`
    );
  }
}

export const env = {
  db: {
    host: process.env.POSTGRES_HOST,
    port: parseNumber(process.env.POSTGRES_PORT, "POSTGRES_PORT"),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseNumber(process.env.SMTP_PORT, "SMTP_PORT"),
    secure: parseBoolean(process.env.SMTP_SECURE),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
  },
};

export const EMAIL_QUEUE_NAME = "espaco_convite";
