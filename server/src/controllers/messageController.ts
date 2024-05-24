import { Request, Response } from "express";

class MessageController {
  async upload(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const uploadedFiles = []
      for (let i = 0; i < files.length; i++) {
        uploadedFiles.push({
          name: files[i].originalname,
          type: files[i].mimetype.split('/')[0],
          url: '',
          path: files[i].path
        })
      }

      res.json({ filesData: uploadedFiles });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }

  }
}
export default new MessageController();
