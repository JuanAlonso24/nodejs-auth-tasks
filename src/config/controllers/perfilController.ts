import { IncomingMessage, ServerResponse } from "http";
import { authMiddelware } from "../../middlewares/auth";

export function profileController(req: IncomingMessage, res: ServerResponse) {
  authMiddelware(req, res, () => {
    //aqui pudes acceder al usuario si lo guardaste en req.user
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Acceso concedido a perfil privado" }));
  });
}
