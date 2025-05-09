import { IncomingMessage, ServerResponse } from "http";
import { authMiddelware } from "../../middlewares/auth";
import { User } from "../../models/User";
import mongoose from "mongoose";

export async function getUserByIdController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const userId = req.url?.split("/user/")[1];

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    res.writeHead(400, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "ID Invalido" }));
  }

  try {
    //Buscamos usuario por ID.
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Usuario no Encontrado" }));
    }

    res.writeHead(200, { "content-type": "/application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al obtener Usuario" }));
  }
}
