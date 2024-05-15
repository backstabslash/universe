import { Schema, Document, model } from "mongoose";

export interface IUserRole extends Document {
  user: Schema.Types.ObjectId;
  role: Schema.Types.ObjectId;
}

const UserRoleSchema = new Schema<IUserRole>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

const UserRole = model<IUserRole>("UserRole", UserRoleSchema);

export default UserRole;
