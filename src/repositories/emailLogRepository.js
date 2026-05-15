import { query } from "../config/db.js";

export async function createEmailLog(data) {
  const sql = `
    INSERT INTO email_log
      (id_usuario, email, assunto, corpo, id_convite, erro)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    data.id_usuario,
    data.email,
    data.assunto,
    data.corpo,
    data.id_convite,
    data.erro,
  ];

  const result = await query(sql, values);
  return result.rows[0];
}
