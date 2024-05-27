import { Schema, model, Document } from 'mongoose';
import { IWorkSpace } from './workspaceModel';
import { IRole } from '../user/roleModel';

export interface IWorkspaceRole extends Document {
    role: IRole;
    workspace: IWorkSpace;
}

const WorkspaceRoleSchema = new Schema<IWorkspaceRole>({
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'WorkSpace',
    },
});

const WorkspaceRole = model<IWorkspaceRole>(
    'WorkspaceRole',
    WorkspaceRoleSchema
);

export default WorkspaceRole;
