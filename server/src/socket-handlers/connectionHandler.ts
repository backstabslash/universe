import { Socket } from "socket.io";
import ChannelUser from "../models/channel/channelUserModel";
import UserGroup from "../models/user/userGroupModel";

class ConnectionHandler {
  async joinAndSendChannels(socket: Socket) {
    try {
      if (!socket.data.userId) {
        return;
      }

      const userGroups = await UserGroup.find({ user: socket.data.userId }).populate({
        path: "channels",
        select: "name _id",
      });
      const allChannelIds: string[] = [];
      const result = userGroups.map(group => {
        const channelsRecord: Record<string, { name: string }> = {};
        group.channels.forEach(channel => {
          const channelId = channel._id.toString();
          channelsRecord[channelId] = { name: channel.name };
          if (!allChannelIds.includes(channelId)) {
            allChannelIds.push(channelId);
          }
        });
        return { name: group.name, channels: channelsRecord };
      });

      socket.join(allChannelIds);
      socket.emit("send-channels", result);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ConnectionHandler();
