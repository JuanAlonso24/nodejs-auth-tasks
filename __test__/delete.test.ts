import request from "supertest";
import { server } from "../src/index";
import mongoose from "mongoose";
import { User } from "../src/models/User";
import { ITask, Task } from "../src/models/Task";
import jwt from "jsonwebtoken";
// Config
const JWT_SECRET = process.env.JWT_SECRET || "secret";

let token: string;
let taskId: string;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");

  // Crear usuario
  const user = new User({ email: "test@example.com", password: "1234456" });
  await user.save();

  // Generar token
  token = jwt.sign({ _id: user._id }, JWT_SECRET);

  // Crear tarea asociada al usuario
  const task = new Task({
    title: "Tarea de prueba",
    description: "Description",
    completed: false,
    owner: user._id,
  }) as typeof Task.prototype;

  await task.save();
  taskId = task._id.toString();
});

afterAll(async () => {
  await mongoose.connection.db!.dropDatabase();
  await mongoose.disconnect();
  server.close();
});

describe("DELETE /api/tasks/:id", () => {
  it("debería devolver 401 si no se envía token", async () => {
    const res = await request(server).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(401);
  });

  it("debería devolver 400 si el ID es inválido", async () => {
    const res = await request(server)
      .delete("/api/tasks/123")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  it("debería eliminar la tarea y devolver 200", async () => {
    const res = await request(server)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Tarea elimina correctamente");
  });

  it("debería devolver 404 si la tarea ya fue eliminada", async () => {
    const res = await request(server)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
