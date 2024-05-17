import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  tag: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model<IUser>("User", UserSchema);

export default User;
