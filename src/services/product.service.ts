import { ProductRepository } from '../repository/product.repository';
import { CreateProductInput, UpdateProductInput } from '../dtos/product.dtos';
import { HttpError } from '../errors/http.error';
import fs from 'fs';
import path from 'path';

const repo = new ProductRepository();

function finalImagePath(productId: string, ext: string) {
  return path.join(process.cwd(), 'uploads', 'products', `${productId}${ext}`);
}
function relativeImagePath(productId: string, ext: string) {
  return path.posix.join('/uploads', 'products', `${productId}${ext}`);
}

export class ProductService {
  async create(input: CreateProductInput) {
    const payload: any = { ...input, likes: [], noOfLikes: 0 };
    const product = await repo.create(payload);
    return product;
  }

  async getAll(page = 1, size = 10, search?: string) {
    const filter: any = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    return repo.findAll(filter, page, size);
  }

  async getById(id: string) {
    const p = await repo.findById(id);
    if (!p) throw new HttpError(404, 'Product not found');
    return p;
  }

  async getByAuthor(retailerAuthId: string, page = 1, size = 10) {
    const filter: any = { retailerAuthId };
    return repo.findAll(filter, page, size);
  }

  async update(id: string, input: UpdateProductInput) {
    const existing = await repo.findById(id);
    if (!existing) throw new HttpError(404, 'Product not found');
    const updated = await repo.update(id, input as any);
    return updated;
  }

  async delete(id: string) {
    // remove file(s) that start with id in uploads/products
    const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const f of files) {
        if (f.startsWith(id)) {
          try { fs.unlinkSync(path.join(uploadsDir, f)); } catch {}
        }
      }
    }

    const deleted = await repo.delete(id);
    if (!deleted) throw new HttpError(404, 'Product not found');
    return { success: true };
  }

  /**
   * Called after middleware has saved file as <id><ext> in /uploads/products.
   * We compute ext from the saved filename and update product.image accordingly.
   * @param productId product id (string)
   * @param savedFilename the filename that multer saved (e.g., "12345.jpg" or "unknown.jpg")
   */
  async setImageFromUploadedFile(productId: string, savedFilename: string) {
    // savedFilename may be "<id>.ext" or "unknown.ext" depending on middleware usage.
    // We want final path to be /uploads/products/<productId><ext>
    const ext = path.extname(savedFilename) || '.jpg';
    const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
    const expectedSavedPath = path.join(uploadsDir, savedFilename);

    // If middleware already wrote file as <productId><ext>, nothing to move; else move/rename
    const finalPath = finalImagePath(productId, ext);

    // If the file at expectedSavedPath exists and its name is not productId+ext, rename it
    if (fs.existsSync(expectedSavedPath)) {
      // If expectedSavedPath already equals finalPath, fine
      if (path.resolve(expectedSavedPath) !== path.resolve(finalPath)) {
        // remove existing finalPath if present
        try { if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath); } catch {}
        try { fs.renameSync(expectedSavedPath, finalPath); } catch (err) {
          // fallback copy
          fs.copyFileSync(expectedSavedPath, finalPath);
          try { fs.unlinkSync(expectedSavedPath); } catch {}
        }
      }
    } else {
      // If expectedSavedPath doesn't exist, maybe middleware already wrote finalPath; check finalPath
      if (!fs.existsSync(finalPath)) {
        throw new Error('Uploaded file not found on server');
      }
    }

    const rel = relativeImagePath(productId, ext);
    const updated = await repo.update(productId, { image: rel } as any);
    if (!updated) throw new HttpError(404, 'Product not found');
    return updated;
  }

  async like(productId: string, userId: string) {
    const p = await repo.findById(productId);
    if (!p) throw new HttpError(404, 'Product not found');
    if (!p.likes.includes(userId)) {
      p.likes.push(userId);
      p.noOfLikes = p.likes.length;
      await p.save();
    }
    return { productId, userId, liked: true, noOfLikes: p.noOfLikes };
  }

  async unlike(productId: string, userId: string) {
    const p = await repo.findById(productId);
    if (!p) throw new HttpError(404, 'Product not found');
    const idx = p.likes.indexOf(userId);
    if (idx !== -1) {
      p.likes.splice(idx, 1);
      p.noOfLikes = p.likes.length;
      await p.save();
    }
    return { productId, userId, liked: false, noOfLikes: p.noOfLikes };
  }

  async isLiked(productId: string, userId: string) {
    const p = await repo.findById(productId);
    if (!p) throw new HttpError(404, 'Product not found');
    return { productId, userId, liked: p.likes.includes(userId) };
  }
}
