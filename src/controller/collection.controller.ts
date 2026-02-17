import { Request, Response, NextFunction } from "express";
import { CollectionService } from "../services/collection.service";

export const saveReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerAuthId, reviewId } = req.body;
    const data = await CollectionService.saveReview(consumerAuthId, reviewId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const unsaveReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerAuthId, reviewId } = req.body;
    const data = await CollectionService.unsaveReview(consumerAuthId, reviewId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const saveProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerAuthId, productId } = req.body;
    const data = await CollectionService.saveProduct(consumerAuthId, productId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const unsaveProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerAuthId, productId } = req.body;
    const data = await CollectionService.unsaveProduct(consumerAuthId, productId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getSavedReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerAuthId } = req.params;
    const { page, size } = req.query;
    const data = await CollectionService.getSavedReviewsPaginated(consumerAuthId, Number(page) || 1, Number(size) || 10);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getSavedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerAuthId } = req.params;
    const { page, size } = req.query;
    const data = await CollectionService.getSavedProductsPaginated(consumerAuthId, Number(page) || 1, Number(size) || 10);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
