import { Schema, model } from "mongoose";
import { IChannel } from "../channel/channelModel";
import { IUser } from "../user/userModel";

interface IFile extends Document {
  channel?: Schema.Types.ObjectId | IChannel;
  user: Schema.Types.ObjectId | IUser;
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedAt: Date;
}

const FileSchema: Schema = new Schema({
  channel: { type: Schema.Types.ObjectId, ref: "Channel" },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const File = model<IFile>("File", FileSchema);
