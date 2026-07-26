import { Response, NextFunction } from 'express';
import { FriendshipsService } from './friendships.service';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class FriendshipsController {
  private friendshipsService = new FriendshipsService();

  sendFriendRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params as { userId: string }; // Target user to follow/friend
      const friendship = await this.friendshipsService.sendFriendRequest(req.user!.id, userId);
      return sendResponse(res, 201, true, 'Friend request sent', friendship);
    } catch (error) {
      next(error);
    }
  };

  acceptFriendRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params as { userId: string }; // Follower user ID
      const friendship = await this.friendshipsService.acceptFriendRequest(userId, req.user!.id);
      return sendResponse(res, 200, true, 'Friend request accepted', friendship);
    } catch (error) {
      next(error);
    }
  };

  rejectFriendRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params as { userId: string };
      await this.friendshipsService.rejectFriendRequest(userId, req.user!.id);
      return sendResponse(res, 200, true, 'Friend request rejected');
    } catch (error) {
      next(error);
    }
  };

  removeFriend = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params as { userId: string };
      await this.friendshipsService.removeFriend(req.user!.id, userId);
      return sendResponse(res, 200, true, 'Friend removed / Unfollowed successfully');
    } catch (error) {
      next(error);
    }
  };

  getFollowers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const followers = await this.friendshipsService.getFollowers(req.user!.id);
      return sendResponse(res, 200, true, 'Followers fetched successfully', followers);
    } catch (error) {
      next(error);
    }
  };

  getFollowing = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const following = await this.friendshipsService.getFollowing(req.user!.id);
      return sendResponse(res, 200, true, 'Following fetched successfully', following);
    } catch (error) {
      next(error);
    }
  };
}
