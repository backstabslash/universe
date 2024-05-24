import { JWT } from "google-auth-library";
import { google } from "googleapis";
import { driveService } from "../config/config";
import fs from "fs";
import path from "path";

class DriveService {
  private readonly driveServiceEmail: string;
  private readonly driveServicePrivateKey: string;
  private readonly jwtClient: JWT;

  constructor() {
    this.driveServiceEmail = driveService.email;
    this.driveServicePrivateKey = driveService.privateKey;
    this.jwtClient = new JWT({
      email: this.driveServiceEmail,
      key: this.driveServicePrivateKey,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
  }

  async uploadFile(filePath: string): Promise<{ fileId: string; webViewLink: string } | undefined> {
    try {
      const drive = google.drive({ version: "v3", auth: this.jwtClient });

      const fileStream = fs.createReadStream(filePath);
      const fileMetadata = { name: path.basename(filePath) };
      const media = { body: fileStream };

      const uploadedFile = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id, webViewLink",
      });

      if (!uploadedFile.data.webViewLink || !uploadedFile.data.id) {
        throw new Error("Error uploading file");
      }

      await fs.promises.unlink(filePath);
      return { fileId: uploadedFile.data.id, webViewLink: uploadedFile.data.webViewLink };
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  async makeFilePublic(fileId: string): Promise<string | undefined> {
    try {
      const drive = google.drive({ version: "v3", auth: this.jwtClient });

      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const file = await drive.files.get({
        fileId: fileId,
        fields: "webViewLink",
      });

      if (!file.data.webViewLink) {
        throw new Error("Error uploading file");
      }
      return file.data.webViewLink;
    } catch (error) {
      console.error("Error making file public:", error);
    }
  }
}

export default DriveService;
