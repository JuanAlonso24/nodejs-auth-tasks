import mongoose from "mongoose";

if (process.env.NODE_ENV !== "test") {
  process.exit(1);
}

export async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017");
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.log("Error al conectar con MongoDB");
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log(`Deconectado de MongoDB`);
  } catch (err) {
    console.log(`Error al desconectar de MongoDB`, err);
  }
}
