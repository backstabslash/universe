import { Schema, Document, model } from "mongoose";
import { IMessage } from "./messageModel";

export interface IThread extends Document {
  parentMessage: IMessage;
}

const ThreadSchema = new Schema<IThread>({
  parentMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
});

const Thread = model<IThread>("Thread", ThreadSchema);

export default Thread;
