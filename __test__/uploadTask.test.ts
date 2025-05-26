import request from "supertest";
import { server } from "../src/index";
import { connectDB, disconnectDB } from "../src/config/database";
import { User } from "../src/models/User";
import { Task } from "../src/models/Task";
import fs from "fs";
import path from "path";

const app = server;

describe("Subida de archivos a tareas", () => {
  let token: string;
  let taskId: string;

  beforeAll(async () => {
    await connectDB();

    // Crear usuario y loguear
    await request(app).post("/auth/register").send({
      email: "upload@test.com",
      password: "123456",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "upload@test.com",
      password: "123456",
    });

    token = loginRes.body.token;

    // Crear tarea
    const taskRes = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarea para prueba de subida",
        description: "Probando archivo",
      });

    taskId = taskRes.body._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await disconnectDB();
  });

  it("debería subir un archivo a una tarea", async () => {
    const filePath = path.join(__dirname, "files", "test-image.png");

    const res = await request(app)
      .post(`/tasks/${taskId}/upload`)
      .set("Authorization", `Bearer ${token}`)
      .attach("archivo", filePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Archivo subido con éxito");
  });
});
