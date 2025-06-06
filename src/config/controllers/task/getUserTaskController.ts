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
    const {
      page = "1",
      limit = "5",
      completed,
      sortBy = "createdAt",
      order = "desc",
    } = parseUrl.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    //validacion basica de paginacion
    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(limitNumber) ||
      limitNumber < 1
    ) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({ message: "Parametros de validacion invalidos" })
      );
    }

    const query: any = { owner: user._id };
    if (completed === "true" || completed === "false") {
      query.completed = completed === "true";
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const tasks = await Task.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(skip)
      .limit(limitNumber);

    // Agregamos el campo fileUrl si la tarea tiene archivo
    const taskWidthFileUrl = tasks.map((task) => {
      const taskObj = task.toObject();
      return {
        ...taskObj,
        fileUrl: task.file ? `/tasks/${task._id}/file` : null,
      };
    });

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ tasks: taskWidthFileUrl }));
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al obtener tareas" }));
  }
}
