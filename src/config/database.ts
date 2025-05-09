import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017");
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.log("Error al conectar con MongoDB");
    process.exit(1);
  }
}
