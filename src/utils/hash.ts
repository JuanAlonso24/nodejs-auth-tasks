import brypt from "bcrypt";

export async function hashPass(p: string) {
  return brypt.hash(p, 10);
}

export async function comparePass(p: string, h: string) {
  return brypt.compare(p, h);
}
