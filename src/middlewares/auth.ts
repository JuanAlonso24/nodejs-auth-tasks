import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
const SECRET_KEY = "mi_clave_secreta"; //poner en .env en produccion

export async function authMiddelware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
) {
  const authHeaders = req.headers["authorization"];

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    res.writeHead(401, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "Token no proporcionado" }));
  }
  const token = authHeaders.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Usuario no encontrado");

    //@ts-ignore
    req.user = user; //opcional: guardar el usuario en la request

    next();
  } catch (error) {
    res.writeHead(401, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "Token invalido o expirado" }));
  }
}
