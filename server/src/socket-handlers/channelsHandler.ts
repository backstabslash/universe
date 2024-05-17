import { Socket } from "socket.io";
import Message from "../models/message/messageModel";
class ChannelsHandler {
  async getMessages(socket: Socket, data: { channelId: string }) {
    try {
      if (!socket.data.userId) {
        return;
      }

      const userChannelIds = socket.rooms;
      if (!userChannelIds.has(data.channelId)) {
        return;
      }

      const messages = await Message.find({ channel: data.channelId }).populate({
        path: "user",
        select: "name _id",
      });

      socket.emit("recieve-channel-messages", messages);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ChannelsHandler();
