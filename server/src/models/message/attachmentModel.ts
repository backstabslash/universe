import { Schema, Document, model } from "mongoose";

export interface IAttachment extends Document {
  type: string;
  url: string;
  name: string;
}

const AttachmentSchema = new Schema<IAttachment>({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
});

const Attachment = model<IAttachment>("Attachment", AttachmentSchema);

export default Attachment;
