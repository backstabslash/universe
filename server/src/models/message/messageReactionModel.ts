import { Schema, Document, model } from "mongoose";

export interface IMessageReaction extends Document {
  message: Schema.Types.ObjectId;
  reaction: Schema.Types.ObjectId;
}

const MessageReactionSchema = new Schema({
  message: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  reaction: {
    type: Schema.Types.ObjectId,
    ref: "Reaction",
  },
});

const MessageReaction = model<IMessageReaction>("MessageReaction", MessageReactionSchema);

export default MessageReaction;
