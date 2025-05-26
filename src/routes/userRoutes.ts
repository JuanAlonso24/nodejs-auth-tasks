import { IncomingMessage, ServerResponse } from "http";
import { registerControllers } from "../config/controllers/userControllers";
import { loginController } from "../config/controllers/loginControllers";
import { profileController } from "../config/controllers/perfilController";
import { authMiddelware } from "../middlewares/auth";
import { getUsersControllers } from "../config/controllers/getUsersController";
import { getUserByIdController } from "../config/controllers/getUserById";
import { updateUserController } from "../config/controllers/updateController";
import { deleteUserController } from "../config/controllers/deleteUserController";
import { isAdmin } from "../middlewares/isAdmin";
import { checkRole } from "../middlewares/checkRole";

export async function userRouters(req: IncomingMessage, res: ServerResponse) {
  // REGISTRO
  if (req.method === "POST" && req.url === "/register") {
    return registerControllers(req, res);
  }
  if (req.method === "GET" && req.url === "/admin") {
    return authMiddelware(req, res, () => {
      const authorizeAdmin = checkRole(["admin"]);

      return authorizeAdmin(req, res, () => {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Ruta solo para Administradores, Bienvenido",
          })
        );
      });
    });
  }

  if (req.method === "GET" && req.url === "/user-area") {
    return authMiddelware(req, res, () => {
      const authorizeUser = checkRole(["user"]);

      return authorizeUser(req, res, () => {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Ruta solo para usuarios normales, Bienvenido",
          })
        );
      });
    });
  }

  // LOGIN
  if (req.method === "POST" && req.url === "/login") {
    return loginController(req, res);
  }

  // RUTA PRIVADA
  if (req.method === "GET" && req.url === "/private") {
    //llamamon al middleware y pasamos un "next" manual
    return profileController(req, res);
  }

  //GET UERS OF DB
  if (req.method === "GET" && req.url === "/users") {
    return authMiddelware(req, res, () =>
      isAdmin(req, res, () => getUsersControllers(req, res))
    );
  }

  //Get User Of ID
  if (req.method === "GET" && req.url?.startsWith("/user/")) {
    return authMiddelware(req, res, () => getUserByIdController(req, res));
  }

  //Actualiozar el usuario
  if (req.method === "PATCH" && req.url?.startsWith("/user/")) {
    return authMiddelware(req, res, () => updateUserController(req, res));
  }
  if (req.method === "DELETE" && req.url?.startsWith("/user/")) {
    return authMiddelware(req, res, () => deleteUserController(req, res));
  }

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Route not found");
}
