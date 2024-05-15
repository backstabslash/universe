import { Schema, Document, model } from "mongoose";
import { IAttachment } from "./attachmentModel";
import { IMessage } from "./messageModel";

export interface IMessageAttachment extends Document {
  attachment: IAttachment;
  message: IMessage;
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
