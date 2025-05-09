import { IncomingMessage, ServerResponse } from "http";
import { StringDecoder } from "string_decoder";
import bcrypt from "bcrypt";
import { User } from "../../models/User";
import { getIdFromUrl } from "../../utils/getIdFromUrl"; //sirve como auxiliar para extraer el ID
export async function updateUserController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const userId = getIdFromUrl(req.url || "");
  const decoder = new StringDecoder("utf-8");
  let body = "";

  req.on("data", (chunk) => {
    body += decoder.write(chunk);
  });
  req.on("end", async () => {
    body += decoder.end();

    try {
      const data = JSON.parse(body);
      const updateData: any = {};
      if (data.username) updateData.username = data.username;
      if (data.password)
        updateData.password = await bcrypt.hash(data.password, 10);

      if (!data.username && !data.password) {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Nada para actualizar" }));
      }
      const updateUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updateUser) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "User not found" }));
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({ message: "Usuario Actualizado", user: updateUser })
      );
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Error al actualizar el usuario" }));
    }
  });
}
