import { Schema, Document, model } from "mongoose";

export interface IRole extends Document {
  name: string;
}

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
  },
});

const Role = model<IRole>("Role", RoleSchema);

export default Role;
