import { Router } from 'express';
import { MeetupsController } from './meetups.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const meetupsController = new MeetupsController();

router.get('/', meetupsController.searchMeetups);
router.get('/:id', meetupsController.getMeetupById);

router.use(authenticate);
router.post('/', meetupsController.createMeetup);
router.patch('/:id', meetupsController.updateMeetup);
router.delete('/:id', meetupsController.deleteMeetup);

export default router;
