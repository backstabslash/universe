import { Socket } from "socket.io";
import ChannelUser from "../models/channel/channelUserModel";
import UserGroup from "../models/user/userGroupModel";

class ConnectionHandler {
  async joinAndSendChannels(socket: Socket) {
    try {
      if (!socket.data.userId) {
        return;
      }

      let userGroups = await UserGroup.find({ user: socket.data.userId }).populate({
        path: "channels",
        select: "name _id",
      });

      const result = userGroups.map((group) => ({
        name: group.name,
        items: group.channels.map((channel) => ({
          id: channel.id,
          name: channel.name,
        })),
      }));
      const allChannelIds = userGroups.reduce<string[]>((acc, group) => {
        group.channels.forEach((channel) => acc.push(channel.id));
        return acc;
      }, []);

      socket.join(allChannelIds);
      socket.emit("send-channels", result);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ConnectionHandler();
