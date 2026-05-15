export default function summarizeError(error) {
  if (!error) {
    return "Erro desconhecido.";
  }

  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 500);
}
