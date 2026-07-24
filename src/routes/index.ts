import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/users.routes';
import sportRoutes from '../modules/sports/sports.routes';
import venueRoutes from '../modules/venues/venues.routes';
import meetupRoutes from '../modules/meetups/meetups.routes';
import participantRoutes from '../modules/participants/participants.routes';
import friendshipRoutes from '../modules/friendships/friendships.routes';
import reviewRoutes from '../modules/reviews/reviews.routes';
import chatRoutes from '../modules/chats/chats.routes';
import notificationRoutes from '../modules/notifications/notifications.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sports', sportRoutes);
router.use('/venues', venueRoutes);
router.use('/meetups', meetupRoutes);
router.use('/participants', participantRoutes);
router.use('/friendships', friendshipRoutes);
router.use('/reviews', reviewRoutes);
router.use('/chats', chatRoutes);
router.use('/notifications', notificationRoutes);
// router.use('/users', userRoutes);
// router.use('/sports', sportRoutes);
// router.use('/venues', venueRoutes);
// router.use('/meetups', meetupRoutes);
// router.use('/participants', participantRoutes);
// router.use('/friendships', friendshipRoutes);
// router.use('/reviews', reviewRoutes);

export default router;
