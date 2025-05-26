import request from "supertest";
import { server } from "../src/index";
import mongoose from "mongoose";
import { User } from "../src/models/User";
import jwt from "jsonwebtoken";
import { Task } from "../src/models/Task";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

let token: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");

  // Creamos usuario
  const user = new User({ email: "test2@example.com", password: "123456" });
  await user.save();

  userId = user._id.toString();
  token = jwt.sign({ _id: userId }, JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.db!.dropDatabase();
  await mongoose.disconnect();
  server.close();
});

describe("POST /api/tasks", () => {
  it("debería devolver 401 si no se envía token", async () => {
    const res = await request(server).post("/api/tasks").send({
      title: "Test",
      description: "Esto es una descripción válida",
    });
    expect(res.statusCode).toBe(401);
  });

  it("debería devolver 400 si los datos son inválidos", async () => {
    const res = await request(server)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        description: "abc", // muy corta
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("debería crear una tarea y devolver 201 si los datos son válidos", async () => {
    const res = await request(server)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Nueva tarea",
        description: "Descripción válida de tarea",
        completed: false,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("task");
    expect(res.body.task.title).toBe("Nueva tarea");
  });
});
