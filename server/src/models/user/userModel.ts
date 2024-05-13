import { Schema, Document, model } from "mongoose";
import { IGroup } from "./groupModel";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  group: Schema.Types.ObjectId | IGroup;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  group: { type: Schema.Types.ObjectId, ref: "Group" },
});

const User = model<IUser>("User", UserSchema);
