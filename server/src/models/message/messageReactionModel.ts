import { Schema, model } from "mongoose";
import { IUser } from "../user/userModel";
import { IMessage } from "./messageModel";

interface IMessageReaction extends Document {
  message: Schema.Types.ObjectId | IMessage;
  user: Schema.Types.ObjectId | IUser;
  reaction: string;
  reactedAt: Date;
}

const MessageReactionSchema: Schema = new Schema({
  message: { type: Schema.Types.ObjectId, ref: "Message", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reaction: { type: String, required: true },
  reactedAt: { type: Date, default: Date.now },
});

const MessageReaction = model<IMessageReaction>("MessageReaction", MessageReactionSchema);
