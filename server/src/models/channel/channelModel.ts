import { Schema, model } from "mongoose";
import { IUser } from "../user/userModel";

export interface IChannel extends Document {
  channelName: string;
  createdBy: Schema.Types.ObjectId | IUser;
  createdAt: Date;
}

const ChannelSchema: Schema = new Schema({
  channelName: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Channel = model<IChannel>("Channel", ChannelSchema);
