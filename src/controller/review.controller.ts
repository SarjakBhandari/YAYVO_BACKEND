// src/controllers/review.controller.ts
import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { HttpError } from "../errors/http.error";
import path from "path";

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const created = await ReviewService.create(payload);
    return res.status(201).json({ success: true, data: created, message: "Review created" });
  } catch (err) {
    next(err);
  }
};

export const getReviewById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const doc = await ReviewService.getById(id);
    return res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const getReviewsByAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.params.authorId;
    const docs = await ReviewService.getByAuthor(authorId);
    return res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
};

export const listReviewsPaginated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, size, search, sentiment, productName } = req.query;
    const result = await ReviewService.listPaginated({
      page: Number(page) || 1,
      size: Number(size) || 10,
      search: typeof search === "string" ? search : undefined,
      sentiment: typeof sentiment === "string" ? sentiment : undefined,
      productName: typeof productName === "string" ? productName : undefined,
    });
    return res.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (err) {
    next(err);
  }
};

export const isLikedByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userId = req.params.userId;
    const liked = await ReviewService.isLikedByUser(id, userId);
    return res.json({ success: true, data: { liked } });
  } catch (err) {
    next(err);
  }
};

export const likeReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    const updated = await ReviewService.like(id, userId);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const unlikeReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    const updated = await ReviewService.unlike(id, userId);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await ReviewService.update(id, payload);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await ReviewService.delete(id);
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

export const uploadReviewImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!req.file) throw new HttpError(400, "No file uploaded");
    const updated = await ReviewService.uploadImage(id, req.file.path, req.file.originalname);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
