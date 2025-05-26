import { IncomingMessage, ServerResponse } from "http";
import { StringDecoder } from "string_decoder";
import bcrypt from "bcrypt";
import { User } from "../../models/User";
import { userSchema } from "../../validations/userSchema";
let data;

export async function registerControllers(
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
      data = userSchema.parse(JSON.parse(body));
    } catch (err: any) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          message: err.errors?.[0]?.message || "Datos invalidos",
        })
      );
    }
    const { username, password, role } = data;
    try {
      //validar si el usuario y existe
      const userExists = await User.findOne({ username });
      if (userExists) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "El usuario ya existe " }));
        return;
      }

      // Hashea la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      //Crear el nuevo usuario guardado en mongoDB
      const newUser = new User({
        username,
        password: hashedPassword,
        role: role || "user", // si no se envia se usara "user" por defecto
      });
      await newUser.save();

      res.writeHead(201, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "User registrado " }));
    } catch (error: any) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(
        JSON.stringify({ message: error.message || "Error al guardar usuario" })
      );
    }
  });
}
