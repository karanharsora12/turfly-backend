import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const reviewsController = new ReviewsController();

router.get('/user/:userId', reviewsController.getUserReviews);

router.use(authenticate);
router.post('/', reviewsController.createReview);

export default router;
