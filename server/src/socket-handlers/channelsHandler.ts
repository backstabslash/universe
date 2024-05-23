import { Server, Socket } from "socket.io";
import Message from "../models/message/messageModel";
import ChannelUser from "../models/channel/channelUserModel";
import Channel, { ChannelType } from "../models/channel/channelModel";
import mongoose from "mongoose";
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
  async createChannel(
    socket: Socket,
    data: { name: string; private: boolean; readonly: boolean },
    callback: Function
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newChannel = new Channel({
        name: data.name,
        owner: socket.data.userId,
        type: ChannelType.CONVERSATION,
        private: data.private,
        readonly: data.readonly,
      });
      const savedChannel = await newChannel.save({ session });

      const newChannelUser = new ChannelUser({
        user: socket.data.userId,
        channel: savedChannel._id,
      });
      await newChannelUser.save({ session });

      const user = await User.findById(socket.data.userId).populate({
        path: "groupsOrder",
        select: "name _id",
      });
      if (!user) {
        await session.abortTransaction();
        return;
      }
      const userGroup = user.groupsOrder.find((group) => group.name === "General");
      if (!userGroup) {
        await session.abortTransaction();
        return;
      }

      await UserGroup.findOneAndUpdate(
        { _id: userGroup._id },
        { $addToSet: { channels: savedChannel._id } },
        { session }
      );

      await session.commitTransaction();
      socket.join(savedChannel.id);
      callback({ status: "success", data: savedChannel });
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      callback({ status: "error" });
    } finally {
      session.endSession();
    }
  }
  async deleteChannel(id: string, callback: Function, io: Server) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await UserGroup.updateMany({ channels: id }, { $pull: { channels: id } });
      await Message.deleteMany({ channel: id });

      await Channel.deleteOne({ channel: id });
      await session.commitTransaction();
      io.sockets.socketsLeave(id);
      callback({ status: "success" });
    } catch (error) {
      session.abortTransaction();
      console.error(error);
      callback({ status: "error" });
    } finally {
      session.endSession();
    }
  }
  async leaveChannel(socket: Socket, id: string, callback: Function) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await User.findById(socket.data.userId).populate("groupsOrder").exec();
      if (!user) {
        console.error("User not found");
        return;
      }

      for (const group of user.groupsOrder) {
        group.channels = group.channels.filter((channel) => String(channel._id) !== id);
        await group.save();
      }
      await ChannelUser.findOneAndDelete({
        user: socket.data.userId,
        channel: id,
      });
      await session.commitTransaction();
      callback({ status: "success" });
    } catch (error) {
      session.abortTransaction();
      console.error(error);
      callback({ status: "error" });
    } finally {
      session.endSession();
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const channelGroupsToDelete = data.channelGroups.filter(
        (group) => !data.updChannelGroups.some((updGroup) => updGroup.id === group.id)
      );
      if (channelGroupsToDelete.length > 0) {
        await UserGroup.deleteMany({
          _id: { $in: channelGroupsToDelete.map((group) => group.id) },
        }).session(session);
      }

      const newChannelGroups = data.updChannelGroups.filter((group) => !group.id);
      if (newChannelGroups.length > 0) {
        const createdGroups = await UserGroup.insertMany(
          newChannelGroups.map((group) => ({
            name: group.name,
            channels: group.items.map((channel) => channel.id),
          })),
          { session }
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
        await UserGroup.bulkWrite(bulkOps, { session });
      }

      const updatedChannelGroups = data.updChannelGroups.map((group) => ({
        id: group.id,
        name: group.name,
        channels: group.items.map((channel) => channel.id),
      }));

      const groupsOrder = updatedChannelGroups.map((group) => group.id);

      await User.findByIdAndUpdate(socket.data.userId, {
        $set: { groupsOrder: groupsOrder },
      }).session(session);

      await session.commitTransaction();
      session.endSession();

      callback(null, updatedChannelGroups);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      callback(error);
    }
  }
}

export default new ChannelsHandler();
