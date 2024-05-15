import { Schema, Document, model } from "mongoose";

export interface IMessageReaction extends Document {
  message: Schema.Types.ObjectId;
  reaction: Schema.Types.ObjectId;
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
