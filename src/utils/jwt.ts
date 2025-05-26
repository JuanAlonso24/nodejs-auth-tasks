import jwt from "jsonwebtoken";

const SECRET = "mi_clave_secreta"; //idealmente usamos una variable de entorno.

export function generarToken(playoad: object): string {
  return jwt.sign(playoad, process.env.JWT_SECRET!, { expiresIn: "1h" });
}

export function verificarToken(token: string) {
  return jwt.verify(token, SECRET);
}
