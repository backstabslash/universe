import { Socket } from "socket.io";
import ChannelUser from "../models/channel/channelUserModel";
import UserGroup from "../models/user/userGroupModel";
import { ChannelType } from "../models/channel/channelModel";
import User from "../models/user/userModel";
import Message from "../models/message/messageModel";

class ConnectionHandler {
  async joinAndSendChannels(socket: Socket) {
    try {
      if (!socket.data.userId) {
        return;
      }

      const user = await User.findById(socket.data.userId).populate({
        path: "groupsOrder",
        select: "name _id",
      });
      if (!user) {
        return;
      }
      const userGroupsIds = user.groupsOrder.map((group) => group.id);

      const userGroups = await UserGroup.find({ _id: { $in: userGroupsIds } }).populate({
        path: "channels",
        select: "name id owner",
      });

      const channelGroups = userGroups.map((group) => ({
        name: group.name,
        items: group.channels.map((channel) => ({
          id: channel.id,
          name: channel.name,
          ownerId: channel.owner
        })),
      }));
      const allChannelIds = userGroups.reduce<string[]>((acc, group) => {
        group.channels.forEach((channel) => acc.push(channel.id));
        return acc;
      }, []);

      const userChannels = await ChannelUser.find({ user: socket.data.userId }).populate("channel");
      const dms = userChannels.map((userChannel) => {
        if (userChannel.channel.type === ChannelType.DM) {
          return userChannel.channel.id;
        }
      });
      const dmsWithUsers = await ChannelUser.find({ channel: { $in: dms } }).populate({
        path: "user",
        select: "name _id pfp_url",
      });
      const filteredDms: any[] = [];
      for (const dmWithUser of dmsWithUsers) {
        const alreadyInFilteredDm = filteredDms.find(
          (filteredDm) => filteredDm.channel.toString() === dmWithUser.channel.toString()
        );
        if (alreadyInFilteredDm) continue;
        const dublicateDm = dmsWithUsers.find(
          (dm) => dmWithUser.channel.toString() === dm.channel.toString() && dmWithUser.id !== dm.id
        );

        if (dublicateDm && dublicateDm.user.id !== socket.data.userId) {
          filteredDms.push(dublicateDm);
        } else {
          filteredDms.push(dmWithUser);
        }
      }

      const dmsForLastMessage = filteredDms.map((dmsWithUser) => dmsWithUser.channel);
      const latestMessages = await Message.aggregate([
        {
          $match: {
            channel: { $in: dmsForLastMessage },
          },
        },
        {
          $sort: { sendAt: -1 },
        },
        {
          $group: {
            _id: "$channel",
            latestMessage: { $first: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            channel: "$latestMessage.channel",
            sendAt: "$latestMessage.sendAt",
          },
        },
      ]);

      latestMessages.sort((a, b) => b.sendAt - a.sendAt);

      const latestChannelIds = latestMessages.map((message) => message.channel.toString());

      filteredDms.sort((a, b) => {
        const channelAIndex = latestChannelIds.indexOf(a.channel.toString());
        const channelBIndex = latestChannelIds.indexOf(b.channel.toString());
        return channelAIndex - channelBIndex;
      });

      const dmsIds = filteredDms.map((dmsWithUser) => dmsWithUser.channel.toString());

      const notesChannel = filteredDms.find((dm) => dm.user.id === socket.data.userId);

      socket.join(allChannelIds.concat(dmsIds));
      socket.emit("send-channels", {
        channelGroups,
        dmsWithUsers: filteredDms.filter((dm) => dm.user.id !== socket.data.userId),
        notesChannel: {
          id: notesChannel.channel,
          name: "Notes",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ConnectionHandler();
