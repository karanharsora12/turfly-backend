import { Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class NotificationsController {
  private notificationsService = new NotificationsService();

  getUserNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.notificationsService.getUserNotifications(req.user!.id);
      return sendResponse(res, 200, true, 'Notifications fetched successfully', notifications);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const notification = await this.notificationsService.markAsRead(id, req.user!.id);
      return sendResponse(res, 200, true, 'Notification marked as read', notification);
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.notificationsService.markAllAsRead(req.user!.id);
      return sendResponse(res, 200, true, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  };
}
