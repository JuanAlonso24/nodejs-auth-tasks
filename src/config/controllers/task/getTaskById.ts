import { IncomingMessage, ServerResponse } from "http";
import { Task } from "../../../models/Task";
import mongoose from "mongoose";

export async function getTaskByIdController(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const taskId = req.url?.split("/")[3];

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "ID invalido" }));
    }

    //@ts-ignore
    const user = req.user;
    const task = await Task.findOne({ _id: taskId, owner: user._id });

    if (!task) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Trea no encontrada o no autorizada" })
      );
    }

    const taskObj = task.toObject();
    const taskWihthFileUrl = {
      ...taskObj,
      fileUrl: task.file ? `tasks/${task._id}/file` : null,
    };

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ task: taskWihthFileUrl }));
  } catch (err) {
    console.log("Error al obtener tarea por ID: ", err);

    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al obtener tarea" }));
  }
}
