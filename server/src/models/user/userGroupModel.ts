import { Schema, model, Document } from "mongoose";
import { IChannel } from "../channel/channelModel";
import { IUser } from "./userModel";

export interface IUserGroup extends Document {
    user: IUser;
    channels: IChannel[];
    name: string;
}

const UserGroupSchema = new Schema<IUserGroup>({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
