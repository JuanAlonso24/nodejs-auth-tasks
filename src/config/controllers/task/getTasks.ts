import { IncomingMessage, ServerResponse } from "http";

export async function getTaskController(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    //@ts-ignore
    const userId = req.user;
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al obtener las tareas" }));
  }
}
