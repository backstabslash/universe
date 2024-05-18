import { Socket } from "socket.io";
import ChannelUser from "../models/channel/channelUserModel";

class ConnectionHandler {
  async joinAndSendChannels(socket: Socket) {
    try {
      if (!socket.data.userId) {
        return;
      }

      const userChannels = await ChannelUser.find({ user: socket.data.userId }).populate({
        path: "channel",
        select: "name _id",
      });

      const channels = userChannels.map((userChannel) => ({
        name: userChannel.channel.name,
        id: userChannel.channel.id,
      }));

      const channelIds = channels.map((channel) => channel.id);

      socket.join(channelIds);
      socket.emit("send-channels", [{ name: "main", items: channels }]);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ConnectionHandler();
