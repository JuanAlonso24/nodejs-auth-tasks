import { IncomingMessage, ServerResponse } from "http";
import { authMiddelware } from "../middlewares/auth";
import { createTaskController } from "../config/controllers/task/createTask";
import { updateTaskController } from "../config/controllers/task/updateTask";
import { deleteTaskController } from "../config/controllers/task/deleteTaskController";
import { getUserTasksController } from "../config/controllers/task/getUserTaskController";

//CREAR UNA TAREA NUEVA
export async function taskRoutes(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "POST" && req.url === "/tasks") {
    return authMiddelware(req, res, () => createTaskController(req, res));
  }

  //obtener todas las  tareas de ususario autenticado
  if (req.method === "GET" && req.url === "/tasks/user") {
    return authMiddelware(req, res, () => getUserTasksController(req, res));
  }

  //OBTENER TAREA POR ID .
  if (req.method === "GET" && req.url?.startsWith("/tasks?")) {
    return authMiddelware(req, res, () => getUserTasksController(req, res));
  }

  //ACTUALIZAR TAREAS
  if (req.method === "PUT" && req.url?.startsWith("/tasks/")) {
    return authMiddelware(req, res, () => updateTaskController(req, res));
  }

  //ELIMINAR UNA TAREA
  if (req.method === "DELETE" && req.url?.startsWith("/tasks/")) {
    return authMiddelware(req, res, () => deleteTaskController(req, res));
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ message: "Ruta no encontrada en task" }));
}
