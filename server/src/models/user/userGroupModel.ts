import { Schema, model, Document } from "mongoose";
import { IChannel } from "../channel/channelModel";

export interface IUserGroup extends Document {
  channels: IChannel[];
  name: string;
}

const UserGroupSchema = new Schema<IUserGroup>({
  name: {
    type: String,
    required: true,
  },
  channels: [
    {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
});

const UserGroup = model<IUserGroup>("UserGroup", UserGroupSchema);

export default UserGroup;
