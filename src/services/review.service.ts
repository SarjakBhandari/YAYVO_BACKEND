// src/services/review.service.ts
import path from "path";
import fs from "fs-extra";
import { HttpError } from "../errors/http.error";
import { ReviewRepository } from "../repository/review.repository";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/review.dtos";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "reviews");

function normalizeSentiments(input?: string[] | string) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function ensureUploadDir() {
  await fs.ensureDir(UPLOAD_DIR);
}

export const ReviewService = {
  create: async (payload: CreateReviewDto) => {
    if (!payload.title) throw new HttpError(400, "title is required");
    if (!payload.authorId) throw new HttpError(400, "authorId is required");

    const doc = await ReviewRepository.create({
      title: payload.title,
      description: payload.description ?? "",
      sentiments: normalizeSentiments(payload.sentiments),
      productName: payload.productName ?? "",
      productImage: payload.productImage ?? "",
      authorId: payload.authorId,
      authorLocation: payload.authorLocation ?? "",
      noOfLikes: 0,
      likes: [],
    } as any);

    return doc;
  },

  getById: async (id: string) => {
    const doc = await ReviewRepository.findByIdLean(id);
    if (!doc) throw new HttpError(404, "Review not found");
    return doc;
  },

  getByAuthor: async (authorId: string) => {
    return ReviewRepository.findByAuthor(authorId);
  },

  listPaginated: async (opts: { page?: number; size?: number; search?: string; sentiment?: string; productName?: string }) => {
    const page = Math.max(1, Number(opts.page ?? 1));
    const size = Math.max(1, Number(opts.size ?? 10));
    const filter: any = {};

    if (opts.search) {
      const q = new RegExp(opts.search, "i");
      filter.$or = [{ title: q }, { description: q }, { productName: q }];
    }
    if (opts.sentiment) filter.sentiments = opts.sentiment;
    if (opts.productName) filter.productName = new RegExp(opts.productName, "i");

    return ReviewRepository.paginatedList(filter, page, size);
  },

  like: async (id: string, userId: string) => {
    if (!userId) throw new HttpError(400, "userId required");
    const updated = await ReviewRepository.like(id, userId);
    if (!updated) throw new HttpError(404, "Review not found");
    return updated;
  },

  unlike: async (id: string, userId: string) => {
    if (!userId) throw new HttpError(400, "userId required");
    const updated = await ReviewRepository.unlike(id, userId);
    if (!updated) throw new HttpError(404, "Review not found");
    return updated;
  },

  isLikedByUser: async (id: string, userId: string) => {
    if (!userId) throw new HttpError(400, "userId required");
    return ReviewRepository.isLikedBy(id, userId);
  },

  update: async (id: string, payload: UpdateReviewDto) => {
    const toUpdate: any = {};
    if (payload.title !== undefined) toUpdate.title = payload.title;
    if (payload.description !== undefined) toUpdate.description = payload.description;
    if (payload.sentiments !== undefined) toUpdate.sentiments = normalizeSentiments(payload.sentiments);
    if (payload.productName !== undefined) toUpdate.productName = payload.productName;
    if (payload.productImage !== undefined) toUpdate.productImage = payload.productImage;
    if (payload.authorLocation !== undefined) toUpdate.authorLocation = payload.authorLocation;

    const updated = await ReviewRepository.updateById(id, toUpdate);
    if (!updated) throw new HttpError(404, "Review not found");
    return updated;
  },

  delete: async (id: string) => {
    const doc = await ReviewRepository.deleteById(id);
    if (!doc) throw new HttpError(404, "Review not found");

    if (doc.productImage) {
      const filename = path.basename(doc.productImage);
      const full = path.join(UPLOAD_DIR, filename);
      try {
        await fs.remove(full);
      } catch {
        // ignore cleanup errors
      }
    }
    return true;
  },

  /**
   * uploadImage accepts either:
   *  - (id, { diskPath, filename, originalName })
   *  - (id, diskPath, originalName)
   */
  uploadImage: async (id: string, fileOrPath: any, originalName?: string) => {
    if (!id) throw new HttpError(400, "Missing review id");
    if (!fileOrPath) throw new HttpError(400, "No uploaded file provided");

    let diskPath: string | undefined;
    let filename: string | undefined;
    let origName: string | undefined;

    if (typeof fileOrPath === "string") {
      diskPath = fileOrPath;
      origName = originalName;
      filename = origName ? `${id}${path.extname(origName) || ".jpg"}` : undefined;
    } else if (typeof fileOrPath === "object") {
      diskPath = fileOrPath.diskPath ?? fileOrPath.path ?? fileOrPath.filePath;
      filename = fileOrPath.filename ?? (fileOrPath.originalName ? `${id}${path.extname(fileOrPath.originalName)}` : undefined);
      origName = fileOrPath.originalName ?? fileOrPath.originalname ?? originalName;
    }

    if (!diskPath) throw new HttpError(400, "No uploaded file path provided");

    await ensureUploadDir();

    const ext = path.extname(origName || filename || diskPath) || ".jpg";
    const finalFilename = filename ?? `${id}${ext}`;
    const dest = path.join(UPLOAD_DIR, finalFilename);

    try {
      const srcResolved = path.resolve(diskPath);
      const destResolved = path.resolve(dest);

      if (srcResolved !== destResolved) {
        if (await fs.pathExists(destResolved)) {
          await fs.remove(destResolved);
        }
        await fs.move(srcResolved, destResolved, { overwrite: true });
      } else {
        // already in place
      }
    } catch (err: any) {
      throw new HttpError(500, `Failed to store uploaded file: ${err?.message ?? err}`);
    }

    // Use posix join to ensure forward slashes in URL
    const imagePath = path.posix.join("/uploads", "reviews", finalFilename);

    const updated = await ReviewRepository.updateById(id, { productImage: imagePath } as any);
    if (!updated) throw new HttpError(404, "Review not found");

    return updated;
  },
};
