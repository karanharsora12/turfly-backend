import { Router } from 'express';
import { ChatsController } from './chats.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const chatsController = new ChatsController();

router.use(authenticate);

router.get('/', chatsController.getUserChats);
router.get('/:chatId/messages', chatsController.getChatMessages);

export default router;
