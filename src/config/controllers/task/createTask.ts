import { IncomingMessage, ServerResponse } from "http";
import { StringDecoder } from "string_decoder";
import { Task } from "../../../models/Task";
import { validateTask } from "../../../routes/validations/task.schema";

export function createTaskController(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.headers["content-type"] !== "application/json") {
    res.writeHead(425, { "content-type": "application/json" });
    return res.end(
      JSON.stringify({ message: "Tipo de contenido no soportado" })
    );
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

      //validar con Zod.
      const validation = validateTask(parsed);

      if (!validation.success) {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "Datos Invalidos",
            errors: validation.error.errors,
          })
        );
      }
      const { title, description, completed } = validation.data;

      //@ts-ignore
      const user = req.user;

      const newTask = new Task({
        title,
        description,
        completed: completed ?? false,
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
