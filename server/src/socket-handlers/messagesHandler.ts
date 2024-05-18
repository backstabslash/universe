import { Socket } from "socket.io";
import Message from "../models/message/messageModel";

type Message = {
  textContent: any;
  sendAt: number;
  attachments: any;
  user: { id: string; name: string };
};
class MessagesHandler {
  async sendMessage(
    socket: Socket,
    data: { channelId: string; message: Message },
    callback: Function
  ) {
    try {
      if (!socket.data.userId) {
        return;
      }
      console.log(data);
      socket.broadcast.to(data.channelId).emit("receive-message", {
        message: {
          ...data.message,
        },
      });

      await Message.create({
        user: socket.data.userId,
        textContent: data.message.textContent,
        channel: data.channelId,
        sendAt: data.message.sendAt,
      });

      callback({ status: "success", message: "Message sent" });
    } catch (error) {
      callback({ status: "error", message: "Error sending message" });
      console.error(error);
    }
  }
}

export default new MessagesHandler();
