import { Socket } from "socket.io";
import Message from "../models/message/messageModel";
import ChannelUser from "../models/channel/channelUserModel";
import mongoose from "mongoose";
import Channel, { ChannelType } from "../models/channel/channelModel";
import User from "../models/user/userModel";
import UserGroup from "../models/user/userGroupModel";
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
  async createChannel(socket: Socket, data: { name: string, private: boolean, readonly: boolean }, callback: Function) {
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

}

export default new ChannelsHandler();
