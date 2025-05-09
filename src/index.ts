import http from "http";
import { userRouters } from "./routes/userRoutes";
import { connectDB } from "./config/database";
import { taskRoutes } from "./routes/taskRoutes";

connectDB();

export const server = http.createServer((req, res) => {
  if (req.url?.startsWith("/tasks")) {
    return taskRoutes(req, res);
  }
  //por defecto todas las demas van a usuarios
  return userRouters(req, res);
});

server.listen(3000, () => {
  console.log(`Server listener on port 3000`);
});
