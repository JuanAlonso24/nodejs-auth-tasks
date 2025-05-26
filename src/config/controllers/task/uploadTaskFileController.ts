import { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import formidable from "formidable";
import path from "path";
import { Task } from "../../../models/Task";
import mongoose from "mongoose";

export async function uploadTaskFileController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const taskId = req.url?.split("/")[2];

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    res.writeHead(400, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "ID de tarea inválido" }));
  }

  //@ts-ignore
  const user = req.user;

  const uploadDir = path.join(__dirname, "../../../../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.writeHead(500, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Error al procesar archivo" }));
    }

    const file = files.file as formidable.File | undefined;

    if (!file) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Archivo no proporcionado" }));
    }

    // Opconal validar tipo MIME
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype || "")) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Tipo de archivo no permitido" }));
    }

    const task = await Task.findOne({ _id: taskId, owner: user._id });
    if (!task) {
      //Eliminar archivo subido ya que la tarea no existe
      if (fs.existsSync(file.filepath)) fs.unlinkSync(file.filepath);

      res.writeHead(404, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Tarea no encontrada" }));
    } else {
      //eliminar archivo anterior si existe
      if (task.file) {
        const oldPath = path.join(__dirname, "../../../../uploads", task.file);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    task.file = path.basename(file.filepath); // guardamos solo el nombre
    await task.save();

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ message: "Archivo subido y tarea actualizada", task })
    );
  });
}
