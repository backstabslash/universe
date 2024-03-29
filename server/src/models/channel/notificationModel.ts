import { Schema, model } from "mongoose";
import { IUser } from "../user/userModel";

interface INotification extends Document {
  user: Schema.Types.ObjectId | IUser;
  notificationType: string;
  notificationData: object;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  notificationType: { type: String, required: true },
  notificationData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Notification = model<INotification>("Notification", NotificationSchema);
