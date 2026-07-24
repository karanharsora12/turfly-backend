import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ChatsService } from '../modules/chats/chats.service';
import { NotificationsService } from '../modules/notifications/notifications.service';

export let io: SocketIOServer;

const chatsService = new ChatsService();
const notificationsService = new NotificationsService();

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Join a personal room for targeted notifications
    socket.on('join_personal_room', (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their personal room`);
    });

    // Join a chat room
    socket.on('join_chat_room', (chatId: string) => {
      socket.join(`chat_${chatId}`);
      console.log(`User joined chat room: ${chatId}`);
    });

    socket.on('send_message', async (data: { chatId: string, senderId: string, content?: string, image?: string, location?: any }) => {
      try {
        const message = await chatsService.saveMessage(
          data.chatId,
          data.senderId,
          data.content,
          data.image,
          data.location
        );

        // Broadcast to the chat room
        io.to(`chat_${data.chatId}`).emit('new_message', message);
      } catch (error) {
        console.error('Error saving message via socket', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
