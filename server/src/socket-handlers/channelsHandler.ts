import { Socket } from "socket.io";
import Message from "../models/message/messageModel";
import ChannelUser from "../models/channel/channelUserModel";
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

      const hasMoreMessages = messages.length === data.limit;
      const formattedMessages = messages.map((message) => ({
        id: message.id,
        textContent: message.textContent,
        sendAt: message.sendAt,
        attachments: message.attachments,
        user: message.user,
      }));

      const channelUsers = await ChannelUser.find({
        channel: data.channelId,
      }).populate("user", "name id");



      socket.emit("recieve-channel-messages", {
        messages: formattedMessages,
        hasMoreMessages,
        users: channelUsers.map((cu) => cu.user),
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ChannelsHandler();
