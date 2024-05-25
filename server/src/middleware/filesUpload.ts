import fs from "fs";
import path from "path";
import multer from "multer";

const APPLICATION_CONSTANTS = {
  DOCUMENTS: {
    MAXIMUM_FILE_SIZE: 1024 * 1024 * 200,
  },
};

function checkFileType(_req: any, file: any, cb: any) {
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
  cb(null, true);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const multerOptions = {
  storage,
  fileFilter: checkFileType,
  limits: {
    fileSize: APPLICATION_CONSTANTS.DOCUMENTS.MAXIMUM_FILE_SIZE,
  },
};

const upload = multer(multerOptions);

export default upload;
