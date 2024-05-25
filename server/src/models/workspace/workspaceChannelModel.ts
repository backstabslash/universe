import { Schema, model, Document } from 'mongoose';
import { IWorkSpace } from './workspaceModel';
import { IChannel } from '../channel/channelModel';

export interface IWorkspaceChannel extends Document {
  channel: IChannel;
  workspace: IWorkSpace;
}

const WorkspaceChannelSchema = new Schema<IWorkspaceChannel>({
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  },
  workspace: {
    type: Schema.Types.ObjectId,
    ref: 'WorkSpace',
  },
});

const WorkspaceChannel = model<IWorkspaceChannel>(
  'WorkspaceChannel',
  WorkspaceChannelSchema
);

export default WorkspaceChannel;
