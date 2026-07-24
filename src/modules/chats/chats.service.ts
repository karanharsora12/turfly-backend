import prisma from '../../utils/prisma';

export class ChatsService {
  async getUserChats(userId: string) {
    return prisma.chat.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, fullName: true, profileImage: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        meetup: { select: { title: true, sport: true } }
      }
    });
  }

  async getChatMessages(chatId: string, userId: string) {
    // Verify user is in chat
    const participant = await prisma.chatParticipant.findUnique({
      where: { chatId_userId: { chatId, userId } }
    });

    if (!participant) {
      const error: any = new Error('Not a participant of this chat');
      error.statusCode = 403;
      throw error;
    }

    return prisma.message.findMany({
      where: { chatId },
      include: {
        sender: { select: { id: true, fullName: true, profileImage: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async saveMessage(chatId: string, senderId: string, content?: string, image?: string, location?: any) {
    return prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
        image,
        location
      },
      include: {
        sender: { select: { id: true, fullName: true, profileImage: true } }
      }
    });
  }
}
