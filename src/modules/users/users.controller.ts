import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { sendResponse } from '../../utils/response';
import { updateUserSchema } from './users.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class UsersController {
  private usersService = new UsersService();

  getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.usersService.getUserById(req.user!.id);
      return sendResponse(res, 200, true, 'Profile fetched successfully', user);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const user = await this.usersService.updateUser(req.user!.id, validatedData);
      return sendResponse(res, 200, true, 'Profile updated successfully', user);
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const user = await this.usersService.getUserById(id);
      if (!user) {
        return sendResponse(res, 404, false, 'User not found');
      }
      return sendResponse(res, 200, true, 'User fetched successfully', user);
    } catch (error) {
      next(error);
    }
  };

  searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      const users = await this.usersService.searchUsers(q as string);
      return sendResponse(res, 200, true, 'Users fetched successfully', users);
    } catch (error) {
      next(error);
    }
  };
}
