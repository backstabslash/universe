import { Schema, model, Document } from "mongoose";
import { IChannel } from "./channelModel";
import { IUser } from "../user/userModel";

export interface IChannelUser extends Document {
  user: IUser;
  channel: IChannel;
}

const ChannelUserSchema = new Schema<IChannelUser>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
  },
});

const ChannelUser = model<IChannelUser>("ChannelUser", ChannelUserSchema);

export default ChannelUser;
