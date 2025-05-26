import request from "supertest";
import { server } from "../src/index";
import mongoose, { set } from "mongoose";
import { User } from "../src/models/User";
import jwt from "jsonwebtoken";

let token: string;
let userId: string;
//Antes de correr el test, conectamos y desconectamos de mongoDB.
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");

  // Limpiamos la base de datos
  await User.deleteMany({});

  // Crea un usuario de prueba
  const testUser = new User({
    name: "Test User",
    email: "test@example.com",
    password: "hashed_password_aqui",
  });
  const savedUser = await testUser.save();
  userId = savedUser._id.toString();

  //Generar el token JWT como lo hacemos normalmente
  token = jwt.sign({ id: userId }, "clave_secreta", { expiresIn: "1h" });
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

describe("GET /tasks/user", () => {
  it("deberia de devolver 401 si no se envia token", async () => {
    const res = await request(server).get("/tasks/user");
    expect(res.statusCode).toBe(401);
  });

  it("deberia de devolver 200 con token valido", async () => {
    const res = await request(server)
      .get("tasks/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("tasks");
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });
});

describe("POST /tasks", () => {
  it("Deberi crear una tarea con un token valido", async () => {
    const newTask = {
      title: "Tarea de prueba",
      description: "Esta tarea es creada durante un test",
    };
    const res = await request(server)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Tarea creada correctamente");
    expect(res.body).toHaveProperty("tasks");
    expect(res.body.task.title).toBe(newTask.title);
    expect(res.body.task.owner).toBe(userId);
  });

  it("deberia devolver 400 si falta el titulo", async () => {
    const tareaSinTitulo = {
      description: "Falta titulo",
    };
    const res = await request(server)
      .post("/yasks")
      .set("Authorization", `Bearer ${token}`)
      .send(tareaSinTitulo);

    expect(res.statusCode).toBe(400);
  });
});

let tareaId: string;

describe("GET /tasks/:id", () => {
  beforeAll(async () => {
    // Creamos una tarea para poder probar la obtencion por ID
    const res = await request(server)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarea de prueba",
        description: "Para probar el GET por ID",
      });

    tareaId = res.body.task._id;
  });

  it("Deberia devolver una tarea valida si el ID existe y pertenece al usuario ", async () => {
    const res = await request(server)
      .get(`/tasks/${tareaId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("task");
    expect(res.body.Task._id).toBe(tareaId);
  });

  it("deberia devolver 404 si la tarea no existe o no fue encontrada", async () => {
    const fakeId = "64ddc7e78f5994ed1e98a999";
    const res = await request(server)
      .get(`/tasks/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Tarea no encontrada o no autorizada");
  });
  it("deberia devolver 400 si el ID es invalido", async () => {
    const res = await request(server)
      .get("/tasks/id_invalido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("ID invalido");
  });
});

describe("PUT /tasks/:id", async () => {
  let tareaParaActualizar: string;

  beforeAll(async () => {
    const res = await request(server)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Trea a actualiazar",
        description: "Original",
      });
    tareaParaActualizar = res.body.task._id;
  });

  it("deberia actualizar una tarea correctamente ", async () => {
    const res = await request(server)
      .put(`/tasks/${tareaParaActualizar}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarea actualizada",
        completed: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.task.title).toBe("Tarea actualizada");
    expect(res.body.task.completed).toBe(true);
  });
  it("deberia de devolver 400 si el ID es invalido", async () => {
    const res = await request(server)
      .put("/tasks/id_invalido")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "test" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("ID invalido");
  });

  it("deberia devolver 404 si la tarea no fue encontrada", async () => {
    const fakeId = "64ddc7e78f5994ed1e98a999";
    const res = await request(server)
      .put(`/tasks/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "test" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Tarea no encontrada o no autorizada");
  });
});

describe("DELETE /tasks/:id", async () => {
  let tareaParaEliminar: string;

  beforeAll(async () => {
    const res = await request(server)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarea a eliminar",
        description: "Borrar luego",
      });
    tareaParaEliminar = res.body.task._id;
  });

  it("deberia eliminar una tarea correctamente", async () => {
    const res = await request(server)
      .delete(`/tasks/${tareaParaEliminar}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Tarea eliminada correctamente");
  });
  it("deberia devolver 400 si el ID es invalido", async () => {
    const res = await request(server)
      .delete("tasks/id_invalido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("ID invalido");
  });

  it("deberia devolver 404 si la tarea no existe", async () => {
    const fakeId = "64ddc7e78f5994ed1e98a999";
    const res = await request(server)
      .delete(`/tasks/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Trea no encontrada o no actualizada");
  });
});

describe("POST /tasks/:id/upload", () => {
  let tareaConArchivoId: string;

  beforeAll(async () => {
    const res = await request(server)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarea con archivo",
        description: "Debe tener archivo",
      });

    tareaConArchivoId = res.body.task._id;
  });

  it("debería subir un archivo correctamente", async () => {
    const res = await request(server)
      .post(`/tasks/${tareaConArchivoId}/upload`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", "testFile.txt");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Archivo subido y tarea actualizada");
    expect(res.body.task.file).toBeDefined();
  });

  it("debería fallar si no se envía archivo", async () => {
    const res = await request(server)
      .post(`/tasks/${tareaConArchivoId}/upload`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Archivo no proporcionado");
  });
});

describe("GET /tasks/:id/download", () => {
  let tareaConArchivoId: string;

  it("debería descargar el archivo correctamente", async () => {
    const res = await request(server)
      .get(`/tasks/${tareaConArchivoId}/download`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-disposition"]).toMatch(/attachment/);
  });

  it("debería fallar si el archivo no existe", async () => {
    const fakeId = "64ddc7e78f5994ed1e98a888";

    const res = await request(server)
      .get(`/tasks/${fakeId}/download`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
