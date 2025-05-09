import { generarToken, verificarToken } from "../src/utils/jwt";

describe("JWT Utils", () => {
  const user = "Juan";
  let token: string;

  it("generar un token valido", () => {
    token = generarToken(user);
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
