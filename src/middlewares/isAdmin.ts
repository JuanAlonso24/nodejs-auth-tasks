import { IncomingMessage, ServerResponse } from "http";

export function isAdmin(
  req: IncomingMessage & { user?: any },
  res: ServerResponse,
  next: () => void
) {
  if (req.user?.role !== "admin") {
    res.writeHead(403, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "Acceso denegado: solo Admins" }));
  }
  next();
}
