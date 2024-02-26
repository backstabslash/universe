import { Socket } from "socket.io";

export const sendMessage = (socket: Socket): void => {
  socket.on("send-message", async (message: any) => {
    console.log(message);

    socket.emit("message", "Hello world");
  });
};
