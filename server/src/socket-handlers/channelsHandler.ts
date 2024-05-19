import { Socket } from "socket.io";
import Message from "../models/message/messageModel";
class ChannelsHandler {
  async getMessages(socket: Socket, data: { channelId: string; limit: number; page: number }) {
    try {
      if (!socket.data.userId) {
        return;
      }

      const userChannelIds = socket.rooms;
      if (!userChannelIds.has(data.channelId)) {
        return;
      }

      const skip = data.page * data.limit;
      const messages = await Message.find({ channel: data.channelId })
        .populate({ path: "user", select: "name id" })
        .sort({ sendAt: -1 })
        .skip(skip)
        .limit(data.limit);
      console.log(messages);
      socket.emit("recieve-channel-messages", messages);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ChannelsHandler();
