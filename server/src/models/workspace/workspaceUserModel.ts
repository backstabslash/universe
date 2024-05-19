import { Schema, model, Document } from 'mongoose';
import { IWorkSpace } from './workspaceModel';
import { IUser } from '../user/userModel';

export interface IWorkspaceUser extends Document {
  user: IUser;
  workspace: IWorkSpace;
}

const WorkspaceUserSchema = new Schema<IWorkspaceUser>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  workspace: {
    type: Schema.Types.ObjectId,
    ref: 'WorkSpace',
  },
});

const WorkspaceUser = model<IWorkspaceUser>(
  'WorkspaceUser',
  WorkspaceUserSchema
);

export default WorkspaceUser;
