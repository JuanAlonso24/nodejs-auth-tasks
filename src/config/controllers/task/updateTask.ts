import { IncomingMessage, ServerResponse } from "http";
import { Task } from "../../../models/Task";
import { StringDecoder } from "string_decoder";
import mongoose from "mongoose";
import { validateTaskUpdate } from "../../../routes/validations/task.schema";

export async function updateTaskController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const taskId = req.url?.split("/")[2];

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    res.writeHead(400, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "ID de tarea invalido" }));
  }
  const decoder = new StringDecoder("utf-8");
  let body = "";

  req.on("data", (chunk) => {
    body += decoder.write(chunk);
  });
  req.on("end", async () => {
    body += decoder.end();

    try {
      const parsed = JSON.parse(body);

      // Validar datos
      const validation = validateTaskUpdate(parsed);

      if (!validation.success) {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "Datos invalidos",
            errors: validation.error.errors,
          })
        );
      }
      const updates = validation.data;

      //@ts-ignore
      const user = req.user;

      const task = await Task.findOne({ _id: taskId, owner: user._id });

      if (!task) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Tarea no encontrada" }));
      }

      Object.assign(task, updates);
      await task.save();

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Tarea actualizada", task }));
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Error al actualizar la tarea" }));
    }
  });
}
