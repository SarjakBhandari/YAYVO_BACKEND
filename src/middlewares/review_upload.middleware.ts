// src/middlewares/review_upload.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "reviews");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const id = req.params.id || Date.now().toString();
    const ext = path.extname(file.originalname) || ".jpg";
    const filename = `${id}${ext}`;
    const fullPath = path.join(UPLOAD_DIR, filename);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.warn("Could not remove existing file before upload:", err);
    }

    cb(null, filename);
  },
});

export const uploadReviewPicture = multer({ storage });
