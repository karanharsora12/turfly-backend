import { Request, Response, NextFunction } from 'express';
import { ReviewsService } from './reviews.service';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
  reviewedUserId: z.string().uuid(),
  meetupId: z.string().uuid(),
});

export class ReviewsController {
  private reviewsService = new ReviewsService();

  createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = reviewSchema.parse(req.body);
      const review = await this.reviewsService.createReview(req.user!.id, validatedData);
      return sendResponse(res, 201, true, 'Review created successfully', review);
    } catch (error) {
      next(error);
    }
  };

  getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const reviews = await this.reviewsService.getUserReviews(userId);
      return sendResponse(res, 200, true, 'Reviews fetched successfully', reviews);
    } catch (error) {
      next(error);
    }
  };
}
