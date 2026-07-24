import prisma from '../../utils/prisma';

export class UsersService {
  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        profileImage: true,
        bio: true,
        city: true,
        country: true,
        skillLevel: true,
        rating: true,
        gamesPlayed: true,
        followersCount: true,
        followingCount: true,
        isOnline: true,
        lastSeen: true,
        preferredSports: {
          include: {
            sport: true
          }
        }
      }
    });
  }

  async updateUser(userId: string, data: any) {
    const { preferredSports, ...userData } = data;

    return prisma.user.update({
      where: { id: userId },
      data: {
        ...userData,
        ...(preferredSports && {
          preferredSports: {
            deleteMany: {},
            create: preferredSports.map((sportId: string) => ({
              sport: { connect: { id: sportId } }
            }))
          }
        })
      },
      select: {
        id: true,
        fullName: true,
        bio: true,
        city: true,
        preferredSports: {
          include: { sport: true }
        }
      }
    });
  }

  async searchUsers(query: string) {
    if (!query) return [];

    return prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        profileImage: true,
        city: true,
        rating: true
      },
      take: 20
    });
  }
}
