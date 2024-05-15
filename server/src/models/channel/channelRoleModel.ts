import { Schema, model, Document } from "mongoose";
import { IChannel } from "./channelModel";
import { IRole } from "../user/roleModel";

export interface IChannelRole extends Document {
  channel: IChannel;
  role: IRole;
}

const ChannelRoleSchema = new Schema<IChannelRole>({
  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  },
});

const ChannelRole = model<IChannelRole>("ChannelRole", ChannelRoleSchema);

export default ChannelRole;
