import { Request, Response } from "express";

class MessageController {
  upload(req: Request, res: Response) {
    const file = req.file as Express.Multer.File;
    const fileId = file.path;
    res.json({ fileId });
  }
}

export default new MessageController();
