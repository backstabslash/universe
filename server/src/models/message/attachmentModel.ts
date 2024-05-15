import { Schema, Document, model } from "mongoose";

export interface IAttachment extends Document {
  type: AttachmentType;
}

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
}

const AttachmentSchema = new Schema<IAttachment>({
  type: {
    type: String,
    enum: Object.values(AttachmentType),
    required: true,
  },
});

const Attachment = model<IAttachment>("Attachment", AttachmentSchema);

export default Attachment;
