import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  tag: string;
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
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
