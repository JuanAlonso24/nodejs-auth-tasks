import mongoose from "mongoose";

export function getIdFromUrl(url: string): string | null {
  const parts = url.split("/"); //ejem: ["","user","123"];
  if (parts.length === 3) {
    const id = parts[2];
    return mongoose.Types.ObjectId.isValid(id) ? id : null;
  }
  return null;
}
