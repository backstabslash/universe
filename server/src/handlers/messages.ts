import { Socket } from "socket.io";

export const sendMessage = (socket: Socket): void => {
  socket.on("send-message", async (message: any) => {
    message[0].children.forEach((element: any) => {
      console.log(element);

    });
    socket.emit("message", "Hello world");
  });
};
