import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";
import { Task } from "../../../models/Task";
import mongoose from "mongoose";

export async function downloadTaskFileController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const taskId = req.url?.split("/")[2];

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    res.writeHead(400, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "ID de tarea invalido" }));
  }

  //@ts-ignore
  const user = req.user;

  try {
    const task = await Task.findOne({ _id: taskId, owner: user._id });

    if (!task || !task.file) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Archivo no encontrado" }));
    }

    const filepath = path.join(__dirname, "../../../../uploads", task.file);

    if (!fs.existsSync(filepath)) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Archivo no existe en el servidor" })
      );
    }

    const fileStream = fs.createReadStream(filepath);

    /*aqui podemos usar la libreria MIME para tener mejor precision */
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${task.file}"`,
      "content-type": "application/octet-stream",
    });

    fileStream.pipe(res);
  } catch (err) {
    console.log("Error al descargar el archivo", err);
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Error interno del servidor" }));
  }
}
