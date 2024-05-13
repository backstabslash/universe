import { Schema, model } from "mongoose";
import { IUser } from "./userModel";
import { IChannel } from "../channel/channelModel";

interface IChannelMember extends Document {
  channel: Schema.Types.ObjectId | IChannel;
  user: Schema.Types.ObjectId | IUser;
  joinedAt: Date;
}

const ChannelMemberSchema: Schema = new Schema({
  channel: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  joinedAt: { type: Date, default: Date.now },
});

const ChannelMember = model<IChannelMember>("ChannelMember", ChannelMemberSchema);
