import { Socket } from "socket.io";
import Message from "../models/message/messageModel";
import User from "../models/user/userModel";

type Message = {
  textContent: any;
  sendAt: number;
  attachments: any;
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

      const userName = await User.findById(socket.data.userId).select("name");

      socket.broadcast.to(data.channelId).emit("receive-message", {
        textContent: data.message.textContent,
        user: { id: socket.data.userId, name: userName },
        sendAt: data.message.sendAt,
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
