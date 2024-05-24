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
    try {
      let attachments;
      if (data.message.attachments) {
        const driveService = new DriveService();
        const uploadAttachments = async (attachments: string[]) => {
          const fileDataArray = await Promise.all(attachments.map(attachment => driveService.uploadFile(attachment)));
          return fileDataArray;
        };
        const fileDataArray = await uploadAttachments(data.message.attachments.map((attachment: { path: string; }) => attachment.path));
        const uploadedFiles = []
        for (let i = 0; i < data.message.attachments.length; i++) {
          uploadedFiles.push({
            name: data.message.attachments[i].name,
            type: data.message.attachments[i].type,
            url: fileDataArray[i]?.webViewLink,
          })
        }
        attachments = await Attachment.insertMany(uploadedFiles);
      }
      const message = await Message.create({
        _id: data.message.id,
        user: socket.data.userId,
        textContent: data.message.textContent,
        channel: data.channelId,
        sendAt: data.message.sendAt,
        attachments: attachments?.map(attachment => attachment._id) || [],
      });

      callback({ status: "success", message: "Message sent" });

      socket.broadcast.to(data.channelId).emit("receive-message", {
        message: {
          id: message.id,
          textContent: message.textContent,
          sendAt: message.sendAt,
          attachments: attachments,
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
