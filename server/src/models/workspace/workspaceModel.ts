import { Schema, Document, model } from "mongoose";

export interface IWorkSpace extends Document {
    workSpaceName: string;
    owner: Schema.Types.ObjectId;
    users: Schema.Types.ObjectId[];
    emailTemplates: string[];
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
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    emailTemplates: [{
        type: String,
        required: true,
        unique: true,
    }],
});

const WorkSpace = model<IWorkSpace>("WorkSpace", WorkSpaceSchema);

export default WorkSpace;
