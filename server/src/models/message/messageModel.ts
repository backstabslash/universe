import { Schema, model } from "mongoose";
import { IChannel } from "../channel/channelModel";
import { IUser } from "../user/userModel";

export interface IMessage extends Document {
  channel: Schema.Types.ObjectId | IChannel;
  user: Schema.Types.ObjectId | IUser;
  messageText: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  channel: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messageText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = model<IMessage>("Message", MessageSchema);
