import { Schema, Document, model } from "mongoose";

export interface IUserVerifyCode extends Document {
    name: string;
    verifyCode: string;
    createdAt: Date;
}

const UserVerifyCodeSchema = new Schema<IUserVerifyCode>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    verifyCode: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

const UserVerifyCode = model<IUserVerifyCode>("UserVerifyCode", UserVerifyCodeSchema);

export default UserVerifyCode;
