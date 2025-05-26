import { IncomingMessage, ServerResponse } from "http";
import { Task } from "../../../models/Task";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export async function deleteTaskController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const taskId = req.url?.split("/")[2];

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    res.writeHead(400, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "ID de la tarea es  Invalido" }));
  }

  //@ts-ignore
  const user = req.user;
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, owner: user._id });
    if (!task) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Tarea no encontrada o no autorizada" })
      );
    }
    //eliminar archivo existente
    if (task.file) {
      const filePath = path.join(__dirname, "../../../../uploads", task.file);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.log(`Error al eliminar archivo: ${err}`);
      }
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Tarea eliminada correctamente", task }));
  } catch (err) {
    console.log("Error al eliminar tarea: ", err);

    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al eliminar la tarea" }));
  }
}
