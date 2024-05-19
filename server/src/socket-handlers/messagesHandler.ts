import { Server, Socket } from "socket.io";
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

      await Message.create({
        user: socket.data.userId,
        textContent: data.message.textContent,
        channel: data.channelId,
        sendAt: data.message.sendAt,
      });

      callback({ status: "success", message: "Message sent" });

      socket.broadcast.to(data.channelId).emit("receive-message", {
        textContent: data.message.textContent,
        sendAt: data.message.sendAt,
        attachments: data.message.attachments,
        user: data.message.user,
      });
    } catch (error) {
      callback({ status: "error", message: "Error sending message" });
      console.error(error);
    }
  }
}

export default new MessagesHandler();
