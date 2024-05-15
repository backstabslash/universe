import { Schema, Document, model } from "mongoose";

export interface IMessageAttachment extends Document {
  attachment: Schema.Types.ObjectId;
  message: Schema.Types.ObjectId;
}

const MessageAttachmentSchema = new Schema<IMessageAttachment>({
  attachment: {
    type: Schema.Types.ObjectId,
    ref: "Attachment",
    required: true,
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
});

const MessageAttachment = model<IMessageAttachment>("MessageAttachment", MessageAttachmentSchema);

export default MessageAttachment;
