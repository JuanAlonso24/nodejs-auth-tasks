import { IncomingMessage, ServerResponse } from "http";
import { authMiddelware } from "../middlewares/auth";
import { createTaskController } from "../config/controllers/task/createTask";
import { updateTaskController } from "../config/controllers/task/updateTask";
import { deleteTaskController } from "../config/controllers/task/deleteTaskController";
import { getUserTasksController } from "../config/controllers/task/getUserTaskController";
import { getTaskByIdController } from "../config/controllers/task/getTaskById";
import { uploadTaskFileController } from "../config/controllers/task/uploadTaskFileController";
import { downloadTaskFileController } from "../config/controllers/task/downloadTaskFileController";

export async function taskRoutes(req: IncomingMessage, res: ServerResponse) {
  // Crear nueva tarea
  if (req.method === "POST" && req.url === "/tasks") {
    return authMiddelware(req, res, () => createTaskController(req, res));
  }

  // Subir archivo a una tarea
  if (
    req.method === "POST" &&
    req.url?.match(/^\/tasks\/[a-f\d]{24}\/upload$/)
  ) {
    return authMiddelware(req, res, () => uploadTaskFileController(req, res));
  }

  // Descargar archivo de una tarea
  if (
    req.method === "GET" &&
    req.url?.match(/^\/tasks\/[a-f\d]{24}\/download$/)
  ) {
    return authMiddelware(req, res, () => downloadTaskFileController(req, res));
  }

  // Obtener tarea por ID
  if (req.method === "GET" && req.url?.match(/^\/tasks\/[a-f\d]{24}$/)) {
    return authMiddelware(req, res, () => getTaskByIdController(req, res));
  }

  // Obtener tareas del usuario autenticado (con filtros y paginación)
  if (req.method === "GET" && req.url?.startsWith("/tasks")) {
    return authMiddelware(req, res, () => getUserTasksController(req, res));
  }

  // Actualizar tarea
  if (req.method === "PUT" && req.url?.startsWith("/tasks/")) {
    return authMiddelware(req, res, () => updateTaskController(req, res));
  }

  // Eliminar tarea
  if (req.method === "DELETE" && req.url?.startsWith("/tasks/")) {
    return authMiddelware(req, res, () => deleteTaskController(req, res));
  }

  // Ruta no encontrada
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ message: "Ruta no encontrada en task" }));
}
