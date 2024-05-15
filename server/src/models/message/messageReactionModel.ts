import { Schema, Document, model } from "mongoose";
import { IMessage } from "./messageModel";
import { IReaction } from "./reactionModel";

export interface IMessageReaction extends Document {
  message: IMessage;
  reaction: IReaction;
}

const MessageReactionSchema = new Schema<IMessageReaction>({
  message: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
  reaction: {
    type: Schema.Types.ObjectId,
    ref: "Reaction",
    required: true,
  },
});

const MessageReaction = model<IMessageReaction>("MessageReaction", MessageReactionSchema);

export default MessageReaction;
