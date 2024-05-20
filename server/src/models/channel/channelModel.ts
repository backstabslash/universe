import { Schema, model, Document } from "mongoose";
import { IUser } from "../user/userModel";
import { boolean } from "joi";

export interface IChannel extends Document {
  name: string;
  owner: IUser;
  private: boolean;
  readonly: boolean;
}

const ChannelSchema = new Schema<IChannel>({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  private: {
    type: Boolean,
    required: true,
  },
  readonly: {
    type: Boolean,
    required: true,
  },
});

const Channel = model<IChannel>("Channel", ChannelSchema);

export default Channel;
