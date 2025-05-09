import { IncomingMessage, ServerResponse } from "http";
import { Task } from "../../../models/Task";
import { StringDecoder } from "string_decoder";
import mongoose from "mongoose";

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
      const updates = JSON.parse(body);
      //@ts-ignore
      const user = req.user;

      const task = await Task.findOneAndUpdate(
        { _id: taskId, owner: user._id },
        updates,
        { new: true }
      );

      if (!task) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({ message: "Tarea no encontrada o no autorizada" })
        );
      }

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Tarea actualizada", task }));
    } catch (err) {
      console.log("Error al actualizar tarea: ", err);

      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Error al actualizar la tarea" }));
    }
  });
}
