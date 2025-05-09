import { IncomingMessage, ServerResponse } from "http";
import { User } from "../../models/User";

export async function getUsersControllers(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const users = await User.find({}, "-password"); //Excluimos la contraseña
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al obtener los Usuarios" }));
  }
}
