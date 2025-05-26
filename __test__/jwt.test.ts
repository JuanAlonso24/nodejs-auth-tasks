import { generarToken, verificarToken } from "../src/utils/jwt";

describe("JWT Utils", () => {
  const user = {
    _id: "2424",
    username: "juanillo",
    role: "user",
  };
  let playoad = { _id: "2424", username: "juanillo", role: "user" };
  let token: string;

  it("generar un token valido", () => {
    token = generarToken(playoad);
    expect(typeof token).toBe("string");
  });

  it("verificar un token valido", () => {
    const playload = verificarToken(token) as any;
    expect(playload.username).toBe(user);
  });

  it("rechazar un token invalido", () => {
    expect(() => verificarToken("token-flaso")).toThrow();
  });
});
