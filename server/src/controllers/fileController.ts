import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import DriveService from "../services/driveService";

class FileController {
  async upload(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        uploadedFiles.push({
          name: files[i].originalname,
          type: files[i].mimetype.split("/")[0],
          url: "",
          path: files[i].path,
        });
      }

      res.json({ filesData: uploadedFiles });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async download(req: Request, res: Response) {
    const { fileId } = req.params;

    try {
      const driveService = new DriveService();
      const metadata = await driveService.getFileMetadata(fileId);
      const fileName = metadata.name;

      const filePath = path.join(__dirname, "../../downloads", fileName);

      await driveService.downloadFile(fileId, filePath);

      res.download(filePath, (err) => {
        if (err) {
          console.error("Error sending file to client:", err);
          res.status(500).send("Error sending file to client");
        } else {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        }
      });
    } catch (error) {
      console.error("Error downloading file from Google Drive:", error);
      res.status(500).send("Error downloading file from Google Drive");
    }
  }
}
export default new FileController();
