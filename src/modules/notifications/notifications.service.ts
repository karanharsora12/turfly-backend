import prisma from '../../utils/prisma';
import { NotificationType } from '../../../generated/prisma';

export class NotificationsService {
  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.userId !== userId) {
      const error: any = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  async createNotification(userId: string, type: NotificationType, content: string, link?: string) {
    return prisma.notification.create({
      data: {
        userId,
        type,
        content,
        link
      }
    });
  }
}
