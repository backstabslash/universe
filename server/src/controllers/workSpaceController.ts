import { Request, Response } from "express";
import { emailRules, emailTemplatesRule, nameRules, tagRules } from "../validation/userDataRules";
import Joi from "joi";
import WorkSpace from "../models/workspace/workspaceModel";
import User from "../models/user/userModel";

class WorkSpacerController {
    async checkName(req: Request, res: Response) {
        const checkNameSchema = Joi.object({
            workSpaceName: nameRules,
        });
        const { error } = checkNameSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        try {
            const { workSpaceName } = req.body;
            const workSpace = await WorkSpace.findOne({ workSpaceName: workSpaceName });
            if (workSpace) {
                return res.status(401).json({
                    message: "Workspace with this name already exists",
                });
            }
            return res.status(200).json({
                message: "Workspace name is available",
            });
        } catch (error) {
            res.status(400).json({
                message: "Internal server error",
            });
        }
    }

    async addWorkSpace(req: Request, res: Response) {
        const addWorkSpaceSchema = Joi.object({
            workSpaceName: nameRules,
            ownerEmail: emailRules,
            emailTemplates: emailTemplatesRule
        });
        const { error } = addWorkSpaceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        try {
            const { ownerEmail, workSpaceName, emailTemplates } = req.body;
            const owner = await User.findOne({ email: ownerEmail });

            const newWorkSpace = new WorkSpace({
                workSpaceName,
                owner: owner?._id,
                emailTemplates,
                users: [owner?._id]
            });
            await newWorkSpace.save();


            return res.status(200).json({});
        } catch (error) {
            try {
                const { ownerEmail } = req.body;
                await User.findOneAndDelete({ email: ownerEmail });
            } catch (error) {
                res.status(405).json({
                    message: "Delete error",
                });
            }
            res.status(403).json({
                message: `This email template exists ${(error as any)?.keyValue?.emailTemplates}`,
            });
        }
    }
}

export default new WorkSpacerController();
