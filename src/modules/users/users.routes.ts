import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const usersController = new UsersController();

router.use(authenticate);

router.get('/me', usersController.getMe);
router.patch('/me', usersController.updateProfile);
router.get('/', usersController.searchUsers);
router.get('/:id', usersController.getUserProfile);

export default router;
