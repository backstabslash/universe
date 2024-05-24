import { Schema, Document, model } from "mongoose";

export interface IAttachment extends Document {
  type: AttachmentType;
  url: string;
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
  url: {
    type: String,
    required: true,
  },
});

const Attachment = model<IAttachment>("Attachment", AttachmentSchema);

export default Attachment;
