import { Schema, model, Document } from "mongoose";

export interface IChannelUser extends Document {
  user: Schema.Types.ObjectId;
  channel: Schema.Types.ObjectId;
}

const ChannelUserSchema: Schema = new Schema({
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
