import prisma from '../../utils/prisma';

export class FriendshipsService {
  async sendFriendRequest(followerId: string, followingId: string) {
    if (followerId === followingId) {
      const error: any = new Error('You cannot follow yourself');
      error.statusCode = 400;
      throw error;
    }

    const existingRequest = await prisma.friendship.findUnique({
      where: {
        followerId_followingId: { followerId, followingId }
      }
    });

    if (existingRequest) {
      const error: any = new Error('Friend request already exists');
      error.statusCode = 400;
      throw error;
    }

    return prisma.friendship.create({
      data: {
        followerId,
        followingId,
        status: 'PENDING'
      }
    });
  }

  async acceptFriendRequest(followerId: string, followingId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (!friendship || friendship.status !== 'PENDING') {
      const error: any = new Error('No pending request found');
      error.statusCode = 404;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const updatedFriendship = await tx.friendship.update({
        where: { followerId_followingId: { followerId, followingId } },
        data: { status: 'ACCEPTED' }
      });

      await tx.user.update({
        where: { id: followingId },
        data: { followersCount: { increment: 1 } }
      });

      await tx.user.update({
        where: { id: followerId },
        data: { followingCount: { increment: 1 } }
      });

      return updatedFriendship;
    });
  }

  async rejectFriendRequest(followerId: string, followingId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (!friendship || friendship.status !== 'PENDING') {
      const error: any = new Error('No pending request found');
      error.statusCode = 404;
      throw error;
    }

    return prisma.friendship.update({
      where: { followerId_followingId: { followerId, followingId } },
      data: { status: 'REJECTED' }
    });
  }

  async removeFriend(followerId: string, followingId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (!friendship) {
      const error: any = new Error('Friendship not found');
      error.statusCode = 404;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      await tx.friendship.delete({
        where: { followerId_followingId: { followerId, followingId } }
      });

      if (friendship.status === 'ACCEPTED') {
        await tx.user.update({
          where: { id: followingId },
          data: { followersCount: { decrement: 1 } }
        });

        await tx.user.update({
          where: { id: followerId },
          data: { followingCount: { decrement: 1 } }
        });
      }
    });
  }

  async getFollowers(userId: string) {
    return prisma.friendship.findMany({
      where: { followingId: userId, status: 'ACCEPTED' },
      include: {
        follower: {
          select: { id: true, fullName: true, username: true, profileImage: true }
        }
      }
    });
  }

  async getFollowing(userId: string) {
    return prisma.friendship.findMany({
      where: { followerId: userId, status: 'ACCEPTED' },
      include: {
        following: {
          select: { id: true, fullName: true, username: true, profileImage: true }
        }
      }
    });
  }
}
