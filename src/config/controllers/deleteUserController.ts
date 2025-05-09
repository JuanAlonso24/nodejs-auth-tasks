import { IncomingMessage, Server, ServerResponse } from "http";
import { User } from "../../models/User";
import { getIdFromUrl } from "../../utils/getIdFromUrl";

export async function deleteUserController(
  req: IncomingMessage,
  res: ServerResponse
) {
  const userId = getIdFromUrl(req.url || "");

  try {
    const deleteUser = await User.findByIdAndDelete(userId);

    if (!deleteUser) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "User Not Found" }));
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ message: "User Delete Correct", user: deleteUser })
    );
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "error al eliminar Usuario" }));
  }
}
