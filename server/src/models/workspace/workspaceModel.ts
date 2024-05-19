import { Schema, Document, model } from "mongoose";
import { IUser } from "../user/userModel";

export interface IWorkSpace extends Document {
  workSpaceName: string;
  owner: IUser;
  emailTemplates: string[];
  pfp_url: string;
}

const WorkSpaceSchema = new Schema<IWorkSpace>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workSpaceName: {
    type: String,
    required: true,
    unique: true,
  },
  pfp_url: {
    type: String,
  },
  emailTemplates: [
    {
      type: String,
      required: true,
      unique: true,
    },
  ],
});

const WorkSpace = model<IWorkSpace>("WorkSpace", WorkSpaceSchema);

export default WorkSpace;
