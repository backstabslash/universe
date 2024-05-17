import { Schema, Document, model } from "mongoose";

export interface IUserVerifyCode extends Document {
    email: string;
    verifyCode: string;
    createdAt: Date;
}

const UserVerifyCodeSchema = new Schema<IUserVerifyCode>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    verifyCode: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60
    }
});

const UserVerifyCode = model<IUserVerifyCode>("UserVerifyCode", UserVerifyCodeSchema);

export default UserVerifyCode;
