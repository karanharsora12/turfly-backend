import { Router } from 'express';
import { ParticipantsController } from './participants.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const participantsController = new ParticipantsController();

router.use(authenticate);

router.post('/:meetupId/join', participantsController.joinMeetup);
router.post('/:meetupId/leave', participantsController.leaveMeetup);
router.patch('/:meetupId/users/:userId/status', participantsController.updateParticipantStatus);

export default router;
