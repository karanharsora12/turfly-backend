import { Response, NextFunction } from "express";
import { ChatsService } from "./chats.service";
import { sendResponse } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class ChatsController {
  private chatsService = new ChatsService();

  getUserChats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const chats = await this.chatsService.getUserChats(req.user!.id);
      return sendResponse(res, 200, true, "Chats fetched successfully", chats);
    } catch (error) {
      next(error);
    }
  };

  getChatMessages = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { chatId } = req.params as { chatId: string };
      const messages = await this.chatsService.getChatMessages(
        chatId,
        req.user!.id,
      );
      return sendResponse(
        res,
        200,
        true,
        "Messages fetched successfully",
        messages,
      );
    } catch (error) {
      next(error);
    }
  };
}
