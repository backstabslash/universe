import http from "http";
import { Server, Socket } from "socket.io";
import app from "./app";
import { api } from "./config/config";
import { sendMessage } from "./handlers/messages";

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket: Socket) => {
  console.info("User connected");

  sendMessage(socket);

  socket.on("disconnect", () => {
    console.info("user disconnected");
  });
});

(async () => {
  try {
    server.listen(api.port, () => {
      console.info(`Server started on ${api.port}`);
    });
  } catch (error) {
    console.error(error);
  }
})();
