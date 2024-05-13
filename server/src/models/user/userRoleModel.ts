import { Schema, Document, model } from "mongoose";

export interface IUserRole extends Document {
  user: Schema.Types.ObjectId;
  role: Schema.Types.ObjectId;
}

const UserRoleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  },
});

const UserRole = model<IUserRole>("UserRole", UserRoleSchema);

export default UserRole;
