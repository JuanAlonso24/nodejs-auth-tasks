import { IncomingMessage, ServerResponse } from "http";

export function checkRole(allowedRoles: string[]) {
  return function (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) {
    //@ts-ignore
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.writeHead(403, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Acceso denegado: Permisos Insuficientes" })
      );
    }
    next();
  };
}
