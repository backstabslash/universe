import { Schema, Document, model } from "mongoose";

export interface IMessage extends Document {
  user: Schema.Types.ObjectId;
  channel: Schema.Types.ObjectId;
  thread: Schema.Types.ObjectId;
  sendAt: number;
}

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: "Thread",
  },
  sendAt: {
    type: Number,
    required: true,
  },
});

const Message = model<IMessage>("Message", MessageSchema);

export default Message;
