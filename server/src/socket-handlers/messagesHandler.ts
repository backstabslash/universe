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
  private driveService: DriveService;

  constructor() {
    this.driveService = new DriveService();
  }
  async sendMessage(
    socket: Socket,
    data: { channelId: string; message: Message },
    callback: Function
  ) {
    try {
      let attachments;
      if (data.message.attachments) {
        const uploadAttachments = async (attachments: string[]) => {
          const fileDataArray = await Promise.all(
            attachments.map((attachment) => this.driveService.uploadFile(attachment))
          );
          return fileDataArray;
        };
        const fileDataArray = await uploadAttachments(
          data.message.attachments.map((attachment: { path: string }) => attachment.path)
        );
        const uploadedFiles = [];
        for (let i = 0; i < data.message.attachments.length; i++) {
          uploadedFiles.push({
            name: data.message.attachments[i].name,
            type: data.message.attachments[i].type,
            url: fileDataArray[i]?.fileId,
          });
        }
        attachments = await Attachment.insertMany(uploadedFiles);
      }
      const message = await Message.create({
        _id: data.message.id,
        user: socket.data.userId,
        textContent: data.message.textContent,
        channel: data.channelId,
        sendAt: data.message.sendAt,
        attachments: attachments?.map((attachment) => attachment._id) || [],
      });

      callback({ status: "success", message: "Message sent", attachments });
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

  async deleteMessage(
    socket: Socket,
    data: { messageId: string; channelId: string },
    callback: Function
  ) {
    try {
      const message = await Message.findById(data.messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      const attachmentIds = message.attachments.map((attachment) => attachment.toString());

      const attachments = await Attachment.find({ _id: { $in: attachmentIds } });
      for (const attachment of attachments) {
        await this.driveService.deleteFile(attachment.url);
      }

      await Attachment.deleteMany({ _id: { $in: attachmentIds } });

      await Message.deleteOne({ _id: data.messageId });

      callback({ status: "success" });
      socket.broadcast.to(data.channelId).emit("on-deleted-message", data);
    } catch (error) {
      callback({ status: "error", message: "Error deleting message" });
      console.error(error);
    }
  }
}

export default new MessagesHandler();
