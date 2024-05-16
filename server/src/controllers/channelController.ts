import { Request, Response } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { channelNameRules } from "../validation/channelDataRules";
import { tagRules } from "../validation/userDataRules";
import { uuidRules } from "../validation/commonDataRules";
import ChannelUser from "../models/channel/channelUserModel";
import Channel from "../models/channel/channelModel";

class ChannelController {
  async getByUserId(req: Request, res: Response) {
    const getUserChannelsByIdSchema = Joi.object({
      userId: uuidRules,
    });
    const { error } = getUserChannelsByIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { userId } = req.params;
      const channels = await ChannelUser.find({ user: userId }).populate("channel");

      if (!channels || channels.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const userChannels = channels.map((channel) => {
        return {
          id: channel.channel._id.toString(),
          name: channel.channel.name,
        };
      });

      return res.status(200).json(userChannels);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    const createChannelSchema = Joi.object({
      name: channelNameRules,
    });
    const { error } = createChannelSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const session = await mongoose.startSession();

    try {
      const { name, userId } = req.body;

      session.startTransaction();

      const channel = new Channel({ name });
      await channel.save({ session });

      const channelUser = new ChannelUser({ user: userId, channel: channel._id });
      await channelUser.save({ session });

      await session.commitTransaction();

      return res.status(201).json({ id: channel._id.toString(), name: channel.name });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: "Internal server error" });
    } finally {
      session.endSession();
    }
  }

  async deleteById(req: Request, res: Response) {
    const removeChannelSchema = Joi.object({
      channelId: uuidRules,
    });
    const { error } = removeChannelSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const session = await mongoose.startSession();

    try {
      const { channelId } = req.params;

      session.startTransaction();

      await Channel.findByIdAndDelete(channelId);
      await ChannelUser.deleteMany({
        channel: channelId,
      });

      await session.commitTransaction();

      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async inviteUserByTag(req: Request, res: Response) {
    const inviteUserSchema = Joi.object({
      channelId: uuidRules,
      tag: tagRules,
    });
    const { error } = inviteUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { channelId, tag } = req.body;

      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      const user = await ChannelUser.findOne({ channel: channelId, user: { tag } });
      if (user) {
        return res.status(400).json({ message: "User already in channel" });
      }

      const newUser = new ChannelUser({ user: { tag }, channel: channelId });
      await newUser.save();

      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async excludeUserByTag(req: Request, res: Response) {
    const excludeUserSchema = Joi.object({
      channelId: uuidRules,
      tag: tagRules,
    });
    const { error } = excludeUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { channelId, tag } = req.body;

      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      const user = await ChannelUser.findOne({ channel: channelId, user: { tag } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await ChannelUser.deleteOne({ channel: channelId, user: user._id });

      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new ChannelController();