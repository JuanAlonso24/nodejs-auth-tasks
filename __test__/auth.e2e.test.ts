import request from "supertest";
import { server } from "../src/index";
import { promises as fs } from "fs";

const USER_FILE = "users.json";

beforeAll(async () => {
  //preparar un user.json limpio.
  await fs.writeFile(USER_FILE, "[]");
});

afterAll((done) => {
  server.close(done);
});

describe("Auth API (E2E)", () => {
  it("POST /register -> 201", async () => {
    const res = await request(server)
      .post("/register")
      .send({ username: "test", password: "password2424" });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/registrado/);
  });

  it("POST /login -> token", async () => {
    const res = await request(server)
      .post("/login")
      .send({ username: "test", password: "password2424" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it("GET /private -> 401 sin token", async () => {
    const res = await request(server).get("/private");
    expect(res.status).toBe(401);
  });

  it("GET /private -> 200 con token", async () => {
    const login = await request(server)
      .post("/login")
      .send({ username: "test", password: "password2424" });

    const token = login.body.token;

    const res = await request(server)
      .get("/private")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/privada/);
  });
});
