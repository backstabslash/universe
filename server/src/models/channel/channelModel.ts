import { Schema, model, Document } from "mongoose";

export interface IChannel extends Document {
  name: string;
}

const ChannelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Channel = model<IChannel>("Channel", ChannelSchema);

export default Channel;
