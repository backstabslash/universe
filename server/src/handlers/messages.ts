import { Socket } from "socket.io";

export const sendMessage = (socket: Socket): void => {
  socket.on("send-message", async () => {
    socket.emit("message", "Hello world");
  });
};
