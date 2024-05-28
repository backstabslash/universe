import { Request, Response } from "express";
import mongoose from "mongoose";
import Channel from "../models/channel/channelModel";
import ChannelUser from "../models/channel/channelUserModel";
import User from "../models/user/userModel";
import WorkspaceUser from "../models/workspace/workspaceUserModel";
import UserGroup from "../models/user/userGroupModel";
import WorkspaceChannel from "../models/workspace/workspaceChannelModel";

interface ChannelData {
	name: string;
	private?: boolean;
	readonly?: boolean;
}

interface Group {
	groupName: string;
	channels: ChannelData[];
}

class WorkspaceTemplateController {
	private universeTemplate: Group[] = [
		{
			groupName: "Announcements",
			channels: [
				{ name: "University-wide Announcements", readonly: true },
				{ name: "Department Announcements", readonly: true },
				{ name: "Sub-department Announcements", readonly: true },
			],
		},
		{
			groupName: "University Administration",
			channels: [{ name: "Rectorate", private: true }],
		},
		{
			groupName: "Educational Departments",
			channels: [
				{ name: "Faculties", private: true },
				{ name: "Educational-Methodological Commissions", private: true },
				{ name: "Other Educational Departments", private: true },
			],
		},
		{
			groupName: "Research Departments",
			channels: [
				{ name: "Academic Council", private: true },
				{ name: "Specific University Departments", private: true },
			],
		},
		{
			groupName: "University Offices",
			channels: [
				{ name: "Educational Office", private: true },
				{ name: "Personnel and Finance Office", private: true },
				{ name: "Household Office", private: true },
			],
		},
		{
			groupName: "Within Departments",
			channels: [
				{ name: "Faculty Administration", private: true },
				{ name: "Faculty Academic Council", private: true },
				{ name: "Educational-Methodological Commissions", private: true },
				{ name: "Departmental", private: true },
			],
		},
	];

	constructor() {
		this.getWorkspaceTemplates = this.getWorkspaceTemplates.bind(this);
		this.createWorkspaceTemplateChannels = this.createWorkspaceTemplateChannels.bind(this);
	}

	async getWorkspaceTemplates(req: Request, res: Response) {
		try {
			return res.status(200).json({ universeTemplate: this.universeTemplate });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ status: "error", message: "Internal server error" });
		}
	}

	async createWorkspaceTemplateChannels(req: Request, res: Response) {
		const { ownerId } = req.body;

		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			for (const group of this.universeTemplate) {
				// Create a new UserGroup for the current group
				const newGroup = new UserGroup({
					name: group.groupName,
					channels: [], // We'll add channels to this group in the next step
				});
				const savedGroup = await newGroup.save({ session });

				// Loop through channels of the current group and add them to the UserGroup
				for (const channelData of group.channels) {
					const newChannel = new Channel({
						name: channelData.name,
						owner: ownerId,
						type: "CONVERSATION",
						private: channelData.private || false,
						readonly: channelData.readonly || false,
					});
					const savedChannel = await newChannel.save({ session });

					// Add the newly created channel to the channels array of the UserGroup
					savedGroup.channels.push(savedChannel?.id);

					const newChannelUser = new ChannelUser({
						user: ownerId,
						channel: savedChannel._id,
					});
					await newChannelUser.save({ session });

					const workspaceUser = await WorkspaceUser.findOne({ user: ownerId });
					if (!workspaceUser) {
						await session.abortTransaction();
						return res.status(404).json({ status: "error", message: "Workspace user not found" });
					}

					await WorkspaceChannel.create(
						[
							{
								workspace: workspaceUser.workspace,
								channel: savedChannel._id,
							},
						],
						{ session }
					);
				}

				// Save the UserGroup after adding all channels
				await savedGroup.save({ session });

				// Add the UserGroup to the groupsOrder array of the user
				const user = await User.findById(ownerId);
				if (!user) {
					await session.abortTransaction();
					return res.status(404).json({ status: "error", message: "User not found" });
				}

				user.groupsOrder.push(savedGroup?.id);
				await user.save({ session });
			}

			await session.commitTransaction();
			return res.status(200).json({ status: "success", message: "Channels created successfully" });
		} catch (error) {
			await session.abortTransaction();
			console.error(error);
			return res.status(500).json({ status: "error", message: "Internal server error" });
		} finally {
			session.endSession();
		}
	}
}

export default new WorkspaceTemplateController();
