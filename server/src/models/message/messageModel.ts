import { Schema, Document, model } from "mongoose";
import { IUser } from "../user/userModel";
import { IChannel } from "../channel/channelModel";
import { IThread } from "./threadModel";
import { IAttachment } from "./attachmentModel";

export interface IMessage extends Document {
  user: IUser;
  textContent: any;
  attachments: IAttachment[];
  channel: IChannel;
  thread: IThread;
  sendAt: number;
}

const MessageSchema = new Schema<IMessage>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  textContent: {
    type: Schema.Types.Mixed,
  },
  attachments: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],
    default: [],
    required: true,
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: "Thread",
  },
  sendAt: {
    type: Number,
    required: true,
  },
});

const Message = model<IMessage>("Message", MessageSchema);

export default Message;
