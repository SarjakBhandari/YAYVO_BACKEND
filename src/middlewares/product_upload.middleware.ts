// middleware/product_upload.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/products");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const authId = req.params.id || "unknown";
    const ext = path.extname(file.originalname);
    cb(null, `${authId}${ext}`);
  },
});

export const uploadProductPicture = multer({ storage });