// src/controllers/review.controller.ts
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { ReviewService } from "../services/review.service";
import { HttpError } from "../errors/http.error";

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const created = await ReviewService.create(payload);
    return res.json({ success: true, data: created });
  } catch (err) {
    return next(err);
  }
};

export const getReviewById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await ReviewService.getById(req.params.id);
    return res.json({ success: true, data: doc });
  } catch (err) {
    return next(err);
  }
};

export const listReviewsPaginated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, size, search, sentiment, productName } = req.query;
    const data = await ReviewService.listPaginated({
      page: Number(page) || 1,
      size: Number(size) || 10,
      search: typeof search === "string" ? search : undefined,
      sentiment: typeof sentiment === "string" ? sentiment : undefined,
      productName: typeof productName === "string" ? productName : undefined,
    });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

export const getReviewsByAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await ReviewService.getByAuthor(req.params.authorId);
    return res.json({ success: true, data: docs });
  } catch (err) {
    return next(err);
  }
};

export const isLikedByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const liked = await ReviewService.isLikedByUser(req.params.id, req.params.userId);
    return res.json({ success: true, data: { liked } });
  } catch (err) {
    return next(err);
  }
};

export const likeReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await ReviewService.like(req.params.id, req.body.userId);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
};

export const unlikeReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await ReviewService.unlike(req.params.id, req.body.userId);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await ReviewService.update(req.params.id, req.body);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ok = await ReviewService.delete(req.params.id);
    return res.json({ success: true, data: ok });
  } catch (err) {
    return next(err);
  }
};

/**
 * Upload image handler
 * - Validates req.file
 * - Passes disk path + metadata to service
 * - Service stores web path in DB and returns updated review
 */
export const uploadReviewImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) throw new HttpError(400, "Missing review id");
    if (!req.file) throw new HttpError(400, "No file uploaded");

    // Multer provides req.file.path (absolute) and req.file.filename
    const diskPath = (req.file as any).path;
    const filename = (req.file as any).filename;
    const originalName = (req.file as any).originalname;

    // Call service with normalized object
    const updated = await ReviewService.uploadImage(id, { diskPath, filename, originalName });

    return res.json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
};
