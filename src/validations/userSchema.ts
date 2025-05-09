import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre del usuario debe de tener al menor 3 caracteres"),
  password: z
    .string()
    .min(6, "La contraseña debe de tener al menos 6 caracteres"),
  role: z.enum(["admin", "user"]).optional(),
});
