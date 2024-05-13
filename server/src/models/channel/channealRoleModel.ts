import { Schema, model, Document } from "mongoose";

export interface IChannelRole extends Document {
  channel: Schema.Types.ObjectId;
  role: Schema.Types.ObjectId;
}

const ChannelRoleSchema: Schema = new Schema({
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
