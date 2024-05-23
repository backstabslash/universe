import { Socket } from "socket.io";
import Message from "../models/message/messageModel";
import ChannelUser from "../models/channel/channelUserModel";
import User from "../models/user/userModel";
import UserGroup from "../models/user/userGroupModel";

interface ChannelGroup {
  id?: string;
  name: string;
  items: Array<Omit<Channel, "messages">>;
}

interface Channel {
  id: string;
  name: string;
  user?: { _id?: string };
}

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

  async updateChannelGroupsOrder(
    socket: Socket,
    data: {
      channelGroups: ChannelGroup[];
      updChannelGroups: ChannelGroup[];
    },
    callback: Function
  ) {
    try {
      const channelGroupsToDelete = data.channelGroups.filter(
        (group) => !data.updChannelGroups.some((updGroup) => updGroup.id === group.id)
      );
      if (channelGroupsToDelete.length > 0) {
        await UserGroup.deleteMany({
          _id: { $in: channelGroupsToDelete.map((group) => group.id) },
        });
      }

      const newChannelGroups = data.updChannelGroups.filter((group) => !group.id);
      if (newChannelGroups.length > 0) {
        const createdGroups = await UserGroup.insertMany(
          newChannelGroups.map((group) => ({
            name: group.name,
            channels: group.items.map((channel) => channel.id),
          }))
        );

        createdGroups.forEach((createdGroup, index) => {
          newChannelGroups[index].id = createdGroup.id;
        });
      }

      const bulkOps = data.updChannelGroups
        .filter((group) => group.id)
        .map((group) => ({
          updateOne: {
            filter: { _id: group.id },
            update: {
              $set: { name: group.name, channels: group.items.map((channel) => channel.id) },
            },
          },
        }));

      if (bulkOps.length > 0) {
        await UserGroup.bulkWrite(bulkOps);
      }

      const updatedChannelGroups = data.updChannelGroups.map((group) => ({
        id: group.id,
        name: group.name,
        channels: group.items.map((channel) => channel.id),
      }));

      const groupsOrder = updatedChannelGroups.map((group) => group.id);

      await User.findByIdAndUpdate(socket.data.userId, {
        $set: { groupsOrder: groupsOrder },
      });

      callback(null, updatedChannelGroups);
    } catch (error) {
      console.error(error);
      callback(error);
    }
  }
}

export default new ChannelsHandler();
