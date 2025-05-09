import { IncomingMessage, ServerResponse } from "http";
import { StringDecoder } from "string_decoder";
import { Task } from "../../../models/Task";

export function createTaskController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const decoder = new StringDecoder("utf-8");
  let body = "";

  req.on("data", (chunk) => {
    body += decoder.write(chunk);
  });

  req.on("end", async () => {
    body += decoder.end();

    try {
      const { title, description } = JSON.parse(body);
      if (!title || !description) {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({ message: "Titulo y descripcion requeridos" })
        );
      }

      //@ts-ignore
      const user = req.user;

      const newTask = new Task({
        title,
        description,
        owner: user._id,
      });

      await newTask.save();

      res.writeHead(201, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Tarea Creada", task: newTask }));
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Error al crear tarea" }));
    }
  });
}
