import jwt from "jsonwebtoken";

const SECRET = "mi_clave_secreta"; //idealmente usamos una variable de entorno.

export function generarToken(id: string, username: string, role: string) {
  return jwt.sign({ id, username, role }, SECRET, { expiresIn: "1h" });
}

export function verificarToken(token: string) {
  return jwt.verify(token, SECRET);
}
