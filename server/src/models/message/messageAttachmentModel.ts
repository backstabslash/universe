import { Schema, Document, model } from "mongoose";

export interface IMessageAttachment extends Document {
  attachment: Schema.Types.ObjectId;
  message: Schema.Types.ObjectId;
}

const MessageAttachmentSchema = new Schema({
  attachment: {
    type: Schema.Types.ObjectId,
    ref: "Attachment",
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
});

const MessageAttachment = model<IMessageAttachment>("MessageAttachment", MessageAttachmentSchema);

export default MessageAttachment;
