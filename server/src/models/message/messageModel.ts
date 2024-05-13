import { Schema, Document, model } from "mongoose";

export interface IMessage extends Document {
  user: Schema.Types.ObjectId;
  channel: Schema.Types.ObjectId;
  thread: Schema.Types.ObjectId;
}

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: "Thread",
  },
});

const Message = model<IMessage>("Message", MessageSchema);

export default Message;
