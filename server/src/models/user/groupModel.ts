import { Schema, model } from "mongoose";

export interface IGroup extends Document {
  groupName: string;
  createdAt: Date;
}

const GroupSchema: Schema = new Schema({
  groupName: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Group = model<IGroup>("Group", GroupSchema);
