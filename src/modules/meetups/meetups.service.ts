import prisma from '../../utils/prisma';

export class MeetupsService {
  async searchMeetups(params: { sportId?: string, date?: string, latitude?: number, longitude?: number, distanceInKm?: number }) {
    const { sportId, date, latitude, longitude, distanceInKm = 20 } = params;

    let whereClause: any = {
      status: 'OPEN',
      isPublic: true
    };

    if (sportId) whereClause.sportId = sportId;
    
    // Date filtering: same day
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.date = {
        gte: startDate,
        lte: endDate
      };
    }

    const meetups = await prisma.meetup.findMany({
      where: whereClause,
      include: {
        sport: true,
        venue: true,
        host: { select: { id: true, fullName: true, profileImage: true, rating: true } }
      },
      orderBy: { date: 'asc' }
    });

    if (latitude && longitude) {
      return meetups.filter(meetup => {
        // If meetup has a venue, use venue coords
        if (meetup.venue) {
          const d = this.calculateDistance(latitude, longitude, meetup.venue.latitude, meetup.venue.longitude);
          return d <= distanceInKm;
        }
        return true; // If no venue, include it or decide logic
      });
    }

    return meetups;
  }

  async getMeetupById(id: string) {
    return prisma.meetup.findUnique({ 
      where: { id },
      include: { 
        sport: true, 
        venue: true,
        host: { select: { id: true, fullName: true, profileImage: true, rating: true } },
        participants: {
          include: {
            user: { select: { id: true, fullName: true, profileImage: true } }
          }
        },
        chat: true
      }
    });
  }

  async createMeetup(hostId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      // Create Meetup
      const meetup = await tx.meetup.create({ 
        data: {
          ...data,
          hostId,
        }
      });

      // Add Host as Approved Participant
      await tx.participant.create({
        data: {
          userId: hostId,
          meetupId: meetup.id,
          status: 'APPROVED'
        }
      });

      await tx.meetup.update({
        where: { id: meetup.id },
        data: { currentPlayers: 1 }
      });

      // Create Group Chat for Meetup
      await tx.chat.create({
        data: {
          type: 'GROUP',
          name: `${data.title} Chat`,
          meetupId: meetup.id,
          participants: {
            create: {
              userId: hostId
            }
          }
        }
      });

      return meetup;
    });
  }

  async updateMeetup(meetupId: string, userId: string, userRole: string, data: any) {
    const meetup = await prisma.meetup.findUnique({ where: { id: meetupId } });
    if (!meetup) throw new Error('Meetup not found');

    if (meetup.hostId !== userId && userRole !== 'ADMIN') {
      const error: any = new Error('Forbidden. You cannot update this meetup.');
      error.statusCode = 403;
      throw error;
    }

    return prisma.meetup.update({
      where: { id: meetupId },
      data
    });
  }

  async deleteMeetup(meetupId: string, userId: string, userRole: string) {
    const meetup = await prisma.meetup.findUnique({ where: { id: meetupId } });
    if (!meetup) throw new Error('Meetup not found');

    if (meetup.hostId !== userId && userRole !== 'ADMIN') {
      const error: any = new Error('Forbidden. You cannot delete this meetup.');
      error.statusCode = 403;
      throw error;
    }

    return prisma.meetup.delete({ where: { id: meetupId } });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }
}
