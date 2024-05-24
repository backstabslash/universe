import { Socket } from "socket.io";
import Message from "../models/message/messageModel";
import DriveService from "../services/driveService";
import Attachment from "../models/message/attachmentModel";

type Message = {
  id: string;
  textContent: any;
  sendAt: number;
  attachments: any;
  user: { _id: string; name: string };
};
class MessagesHandler {
  async sendMessage(
    socket: Socket,
    data: { channelId: string; message: Message },
    callback: Function
  ) {
    let file;
    if (data.message.attachments.length > 0) {
      const driveService = new DriveService();
      const fileData = await driveService.uploadFile(data.message.attachments[0]);
      if (fileData) {
        file = await driveService.makeFilePublic(fileData.fileId);
      }
    }
    try {
      const attachment = await Attachment.create({
        type: "FILE",
        url: file,
      });

      const message = await Message.create({
        _id: data.message.id,
        user: socket.data.userId,
        textContent: data.message.textContent,
        channel: data.channelId,
        sendAt: data.message.sendAt,
        attachments: [attachment],
      });

      callback({ status: "success", message: "Message sent" });

      socket.broadcast.to(data.channelId).emit("receive-message", {
        message: {
          id: message.id,
          textContent: message.textContent,
          sendAt: message.sendAt,
          attachments: message.attachments,
          user: data.message.user,
        },
        channelId: data.channelId,
      });
    } catch (error) {
      callback({ status: "error", message: "Error sending message" });
      console.error(error);
    }
  }
}

export default new MessagesHandler();
