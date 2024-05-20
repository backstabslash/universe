import { Schema, Document, model } from "mongoose";
import { IUser } from "./userModel";
import { IRole } from "./roleModel";

export interface IUserRole extends Document {
  user: IUser;
  role: IRole;
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
