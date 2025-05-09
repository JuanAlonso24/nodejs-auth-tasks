import { IncomingMessage, ServerResponse } from "http";
import { Task } from "../../../models/Task";
import url from "url";
export async function getUserTasksController(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    //@ts-ignore
    const user = req.user;

    const parseUrl = url.parse(req.url || "", true);
    const { page = "1", limit = "5", completed } = parseUrl.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const query: any = { owner: user._id };
    if (completed === "true" || completed === "false") {
      query.completed = completed === "true";
    }

    const tasks = await Task.find(query).skip(skip).limit(limitNumber);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ tasks }));
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al obtener tareas" }));
  }
}
