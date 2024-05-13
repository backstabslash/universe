import { Schema, Document, model } from "mongoose";

export interface IThread extends Document {
  parentMessage: Schema.Types.ObjectId;
}

const ThreadSchema = new Schema({
  parentMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
});

const Thread = model<IThread>("Thread", ThreadSchema);

export default Thread;
