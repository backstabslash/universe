import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  tag: string;
  email: string;
  password: string;
  phone: string;
  pfp_url: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  pfp_url: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model<IUser>('User', UserSchema);

export default User;
