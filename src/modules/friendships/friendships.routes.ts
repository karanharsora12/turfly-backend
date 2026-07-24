import { Router } from 'express';
import { FriendshipsController } from './friendships.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const friendshipsController = new FriendshipsController();

router.use(authenticate);

router.post('/request/:userId', friendshipsController.sendFriendRequest);
router.patch('/request/:userId/accept', friendshipsController.acceptFriendRequest);
router.patch('/request/:userId/reject', friendshipsController.rejectFriendRequest);
router.delete('/:userId', friendshipsController.removeFriend);
router.get('/followers', friendshipsController.getFollowers);
router.get('/following', friendshipsController.getFollowing);

export default router;
