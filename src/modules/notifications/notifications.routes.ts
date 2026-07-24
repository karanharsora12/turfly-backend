import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const notificationsController = new NotificationsController();

router.use(authenticate);

router.get('/', notificationsController.getUserNotifications);
router.patch('/:id/read', notificationsController.markAsRead);
router.patch('/read-all', notificationsController.markAllAsRead);

export default router;
