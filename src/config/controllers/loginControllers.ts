import { IncomingMessage, ServerResponse } from "http";
import { StringDecoder } from "string_decoder";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import { generarToken } from "../../utils/jwt";

const SECRET_KEY = "mi_clave_secreta"; // puedes ponerla en un .env luego

export async function loginController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const decoder = new StringDecoder("utf-8");
  let body = "";

  req.on("data", (chunk) => {
    body += decoder.write(chunk);
  });

  req.on("end", async () => {
    body += decoder.end();

    try {
      const { username, password } = JSON.parse(body);

      if (!username || !password) {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Faltan campos" }));
      }

      const user = await User.findOne({ username }).select("+password");

      if (!user) {
        res.writeHead(401, { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Credenciales Invalidas" }));
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.writeHead(401, { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Contraseña incorrecta" }));
      }

      const token = generarToken({
        _id: user.id.toString(),
        username: user.username,
        role: user.role,
      });

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Login exitoso", token }));
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Error en el servidor" }));
    }
  });
}
