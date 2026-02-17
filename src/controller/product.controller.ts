import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dtos';
import { uploadProductPicture } from '../middlewares/product_upload.middleware'; // your file path
import path from 'path';
import mongoose from 'mongoose';

const service = new ProductService();

// Create product (no image)
export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const targetSentiment = parseTargetSentiment(body.targetSentiment);
    const input = CreateProductDto.parse({
      title: body.title,
      description: body.description,
      retailerAuthId: body.retailerAuthId,
      retailerName: body.retailerName,
      retailerIcon: body.retailerIcon,
targetSentiment
    });
    const product = await service.create(input);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

// Upload image for existing product
// Note: your middleware uses req.params.id to name the file; it will save as <id><ext> in uploads/products
export const uploadProductImage = [
  // multer middleware
  uploadProductPicture.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

      // multer saved file as `${authId}${ext}` where authId is req.params.id (per your middleware)
      // req.file.filename contains the filename (e.g., "<id>.jpg")
      const savedFilename = req.file.filename; // e.g., "12345.jpg"
      // Call service to ensure final path and update DB
      const updated = await service.setImageFromUploadedFile(productId, savedFilename);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
];

// Get all products (paginated)
export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const size = parseInt((req.query.size as string) || '10');
    const search = (req.query.search as string) || undefined;
    const data = await service.getAll(page, size, search);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Get product by id
export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const p = await service.getById(req.params.id);
    res.json(p);
  } catch (err) {
    next(err);
  }
}

// Get by author
export async function getByAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    const authorId = req.params.authorId;
    const page = parseInt((req.query.page as string) || '1');
    const size = parseInt((req.query.size as string) || '10');
    const data = await service.getByAuthor(authorId, page, size);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Update product (fields only)
export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const input = UpdateProductDto.parse({
      title: body.title,
      description: body.description,
      retailerAuthId: body.retailerAuthId,
      retailerName: body.retailerName,
      retailerIcon: body.retailerIcon,
      targetSentiment: body.targetSentiment 
    });
    const updated = await service.update(req.params.id, input);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Delete product
export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const out = await service.delete(req.params.id);
    res.json(out);
  } catch (err) {
    next(err);
  }
}

// Like
export async function likeProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, userId } = req.body;
    const out = await service.like(productId, userId);
    res.json(out);
  } catch (err) {
    next(err);
  }
}

// Unlike
export async function unlikeProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, userId } = req.body;
    const out = await service.unlike(productId, userId);
    res.json(out);
  } catch (err) {
    next(err);
  }
}

export async function isLiked(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = req.query.productId as string;
    const userId = req.query.userId as string;

    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "productId and userId are required",
      });
    }

    const liked = await service.isLiked(productId, userId);

    return res.json({
      success: true,
      liked,
    });

  } catch (err) {
    next(err);
  }
}





function parseTargetSentiment(value: any): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // try JSON first
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // not JSON, fall back to comma-split
    }
    // split by comma and trim
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return undefined;
}
