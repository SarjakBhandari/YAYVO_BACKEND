// src/middleware/product_upload.middleware.ts
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
    const id = req.params.id || "unknown";
    const ext = path.extname(file.originalname) || ".jpg";
    const filename = `${id}${ext}`;
    const fullPath = path.join(UPLOAD_DIR, filename);

    // If a file with the same canonical name exists, remove it so the new upload overwrites cleanly.
    try {
      if (fs.existsSync(fullPath)) {
        // attempt to remove existing file before multer writes the new one
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      // If unlink fails, continue — multer will still attempt to write and may overwrite.
      // Do not block the upload; controller/service should handle any remaining errors.
      // eslint-disable-next-line no-console
      console.warn("Could not remove existing file before upload:", err);
    }

    cb(null, filename);
  },
});

export const uploadReviewPicture = multer({ storage });
