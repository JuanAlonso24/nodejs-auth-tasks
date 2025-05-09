//Aqui guardamos los usarios en el json
import { promises as fs } from "fs";
import bcrypt from "bcrypt";

const FILE_PATH = "users.json";

export async function saveUser(username: string, password: string) {
  try {
    let users: any[] = [];

    try {
      const data = await fs.readFile(FILE_PATH, "utf-8");
      users = JSON.parse(data);
    } catch {
      users = [];
    }
    //validaciones basicas
    if (!username || !password) {
      throw new Error("Flantan campos obligatorios");
    }
    if (username.length === 3) {
      throw new Error(
        "el nombre del ususario debe tener al menos 3 caracteres"
      );
    }
    if (password.length < 6) {
      throw new Error("la contraseña debe de tener al menos 6 caracteres");
    }

    const userExists = users.find((u) => u.username === username);
    if (userExists) {
      throw new Error("el nombre del usuario ya existe");
    }

    //haseamos la contraseña antes de guardarla.
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
  } catch (err: any) {
    console.error("Error en saveUser: ", err);
    throw new Error(err.message || `No se pudo guardar el Usuario`);
  }
}
