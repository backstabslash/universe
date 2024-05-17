import { Server, Socket } from "socket.io";
import Message from "../models/message/messageModel";

type Message = {
  textContent: any;
  attachments: any;
};
class MessagesHandler {
  async sendMessage(io: Server, socket: Socket, data: { channelId: string; message: Message }) {
    try {
      if (!socket.data.userId) {
        return;
      }

      io.in(data.channelId).emit("recieve-message", {
        textContent: data.message.textContent,
      });

      await Message.create({
        user: socket.data.userId,
        textContent: data.message.textContent,
        channel: data.channelId,
        sendAt: Date.now(),
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new MessagesHandler();
