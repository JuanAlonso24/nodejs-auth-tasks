import { hashPass, comparePass } from "../src/utils/hash";

describe("hash Util", () => {
  const passwd = "secreto2424";
  let hash: string;

  it("debe generar un hash", async () => {
    hash = await hashPass(passwd);
    expect(typeof hash).toBe("string");
    expect(hash).not.toBe(passwd);
  });

  it("debe validar contraseña correcta", async () => {
    expect(await comparePass(passwd, hash)).toBe(true);
  });

  it("debe rechazar contraseña incorrecta", async () => {
    expect(await comparePass("otra", hash)).toBe(false);
  });
});
