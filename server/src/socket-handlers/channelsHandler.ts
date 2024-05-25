import { Server, Socket } from 'socket.io';
import Message from '../models/message/messageModel';
import ChannelUser from '../models/channel/channelUserModel';
import Channel, { ChannelType } from '../models/channel/channelModel';
import mongoose from 'mongoose';
import User from '../models/user/userModel';
import UserGroup from '../models/user/userGroupModel';
import WorkspaceUser from '../models/workspace/workspaceUserModel';
import WorkspaceChannel from '../models/workspace/workspaceChannelModel';

interface ChannelGroup {
  id?: string;
  name: string;
  items: Array<Omit<Channel, 'messages'>>;
}

interface Channel {
  id: string;
  name: string;
  user?: { _id?: string };
}

class ChannelsHandler {
  async getMessages(
    socket: Socket,
    data: { channelId: string; limit: number; page: number }
  ) {
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
        .populate({
          path: "attachments",
          select: "name type url",
        })
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
      }).populate('user', 'name id');

      socket.emit('recieve-channel-messages', {
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
        path: 'groupsOrder',
        select: 'name _id',
      });
      if (!user) {
        await session.abortTransaction();
        return callback({ status: 'error', message: 'User not found' });
      }
      const userGroup = user.groupsOrder.find(
        (group) => group.name === 'General'
      );
      if (!userGroup) {
        await session.abortTransaction();
        return callback({ status: 'error', message: 'User group not found' });
      }

      await UserGroup.findOneAndUpdate(
        { _id: userGroup._id },
        { $addToSet: { channels: savedChannel._id } },
        { session }
      );

      const workspaceUser = await WorkspaceUser.findOne({
        user: socket.data.userId,
      });
      if (!workspaceUser) {
        await session.abortTransaction();
        return callback({
          status: 'error',
          message: 'Workspace user not found',
        });
      }

      await WorkspaceChannel.create(
        [
          {
            workspace: workspaceUser.workspace,
            channel: savedChannel._id,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      socket.join(savedChannel.id);
      callback({ status: 'success', data: savedChannel });
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      callback({ status: 'error' });
    } finally {
      session.endSession();
    }
  }
  async createDMChannel(
    socket: Socket,
    data: { user1Id: string; user2Id: string },
    callback: Function
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newDMChannel = new Channel({
        name: `DM-${data.user1Id}-${data.user2Id}`,
        owner: socket.data.userId,
        type: ChannelType.DM,
        private: true,
        readonly: false,
      });
      const savedDMChannel = await newDMChannel.save({ session });

      const newChannelUser1 = new ChannelUser({
        user: data.user1Id,
        channel: savedDMChannel._id,
      });
      const newChannelUser2 = new ChannelUser({
        user: data.user2Id,
        channel: savedDMChannel._id,
      });

      await newChannelUser1.save({ session });
      await newChannelUser2.save({ session });

      await session.commitTransaction();
      socket.join(savedDMChannel.id);
      callback({ status: 'success', data: savedDMChannel });
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      callback({ status: 'error' });
    } finally {
      session.endSession();
    }
  }
  async deleteChannel(
    id: string,
    callback: Function,
    io: Server,
    socket: Socket
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await UserGroup.updateMany({ channels: id }, { $pull: { channels: id } });
      await Message.deleteMany({ channel: id });

      await Channel.deleteOne({ _id: id });
      await WorkspaceChannel.deleteOne({ channel: id });

      await session.commitTransaction();

      socket.broadcast.to(id).emit('channel-deleted', { channel: id });

      io.sockets.socketsLeave(id);
      callback({ status: 'success' });
    } catch (error) {
      session.abortTransaction();
      console.error(error);
      callback({ status: 'error' });
    } finally {
      session.endSession();
    }
  }
  async leaveChannel(socket: Socket, id: string, callback: Function) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await User.findById(socket.data.userId)
        .populate('groupsOrder')
        .exec();
      if (!user) {
        console.error('User not found');
        return;
      }

      for (const group of user.groupsOrder) {
        group.channels = group.channels.filter(
          (channel) => String(channel._id) !== id
        );
        await group.save();
      }
      await ChannelUser.findOneAndDelete({
        user: socket.data.userId,
        channel: id,
      });
      await session.commitTransaction();

      socket.leave(id);
      callback({ status: 'success' });
      socket.broadcast
        .to(id)
        .emit('user-left-channel', { channel: id, userId: socket.data.userId });
    } catch (error) {
      session.abortTransaction();
      console.error(error);
      callback({ status: 'error' });
    } finally {
      session.endSession();
    }
  }

  async addUserToChannel(
    io: Server,
    socket: Socket,
    data: {
      channelId: string;
      id: string;
    },
    callback: Function
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const channelUser = new ChannelUser({
        user: data.id,
        channel: data.channelId,
      });
      await channelUser.save({ session });

      const user = await User.findById(data.id).populate('groupsOrder').exec();
      if (!user) {
        console.error('User not found');
        return;
      }

      const userGroup = user.groupsOrder.find(
        (group) => group.name === 'General'
      );
      if (!userGroup) {
        console.error('Group not found');
        return;
      }

      await UserGroup.findOneAndUpdate(
        { _id: userGroup._id },
        { $addToSet: { channels: data.channelId } },
        { session }
      );

      await session.commitTransaction();
      callback({ status: 'success' });

      let userSocket;
      for (let [id, socket] of io.of('/').sockets) {
        if (socket.data.userId === data.id) {
          userSocket = socket;
        }
      }
      if (userSocket) {
        userSocket.join(data.channelId);
      }

      const channel = await Channel.findById(data.channelId)
        .select('name owner')
        .exec();
      const channelUsers = await ChannelUser.find({
        channel: data.channelId,
      }).populate('user', 'name id');

      socket.broadcast.to(data.channelId).emit('user-joined-channel', {
        channel: {
          id: data.channelId,
          name: channel?.name,
          users: channelUsers.map((cu) => cu.user),
          owner: channel?.owner,
        },
        userId: data.id,
      });
    } catch (error) {
      session.abortTransaction();
      console.error(error);
      callback({ status: 'error' });
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
        (group) =>
          !data.updChannelGroups.some((updGroup) => updGroup.id === group.id)
      );
      if (channelGroupsToDelete.length > 0) {
        await UserGroup.deleteMany({
          _id: { $in: channelGroupsToDelete.map((group) => group.id) },
        }).session(session);
      }

      const newChannelGroups = data.updChannelGroups.filter(
        (group) => group.id && group.id.length < 24
      );
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
              $set: {
                name: group.name,
                channels: group.items.map((channel) => channel.id),
              },
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
