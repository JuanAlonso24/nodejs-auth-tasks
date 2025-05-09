import { IncomingMessage, ServerResponse } from "http";
import { Task } from "../../../models/Task";
import { getIdFromUrl } from "../../../utils/getIdFromUrl";
import mongoose from "mongoose";

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
    const task = await Task.findOneAndDelete({ id: taskId, owner: user._id });
    if (!task) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Tarea no encontrada o no autorizada" })
      );
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Trea elimina correctamente", task }));
  } catch (err) {
    console.log("Error al eliminar tarea: ", err);

    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error al eliminar la tarea" }));
  }
}
