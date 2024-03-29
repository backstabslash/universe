import { Schema, model } from "mongoose";
import { IUser } from "../user/userModel";

interface IDirectMessage extends Document {
  sender: Schema.Types.ObjectId | IUser;
  recipient: Schema.Types.ObjectId | IUser;
  messageText: string;
  createdAt: Date;
}

const DirectMessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messageText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const DirectMessage = model<IDirectMessage>("DirectMessage", DirectMessageSchema);
