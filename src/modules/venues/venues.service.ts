import prisma from '../../utils/prisma';

export class VenuesService {
  async searchVenues(params: { query?: string, latitude?: number, longitude?: number, distanceInKm?: number }) {
    const { query, latitude, longitude, distanceInKm = 10 } = params;

    // First fetch the raw venues (with basic filtering by name)
    const venues = await prisma.venue.findMany({
      where: query ? {
        name: { contains: query, mode: 'insensitive' }
      } : undefined,
      include: {
        sports: { include: { sport: true } }
      }
    });

    // If lat/lng provided, apply Haversine distance filtering in JS 
    // (since we aren't using PostGIS and Prisma doesn't natively support it)
    if (latitude && longitude) {
      return venues.filter(venue => {
        const d = this.calculateDistance(latitude, longitude, venue.latitude, venue.longitude);
        return d <= distanceInKm;
      }).map(venue => ({
        ...venue,
        distance: this.calculateDistance(latitude, longitude, venue.latitude, venue.longitude)
      })).sort((a, b) => a.distance - b.distance);
    }

    return venues;
  }

  async getVenueById(id: string) {
    return prisma.venue.findUnique({ 
      where: { id },
      include: { sports: { include: { sport: true } } }
    });
  }

  async createVenue(data: any) {
    const { sportIds, ...venueData } = data;
    return prisma.venue.create({ 
      data: {
        ...venueData,
        ...(sportIds && {
          sports: {
            create: sportIds.map((sportId: string) => ({
              sport: { connect: { id: sportId } }
            }))
          }
        })
      }
    });
  }

  async updateVenue(id: string, data: any) {
    const { sportIds, ...venueData } = data;
    return prisma.venue.update({ 
      where: { id }, 
      data: {
        ...venueData,
        ...(sportIds && {
          sports: {
            deleteMany: {},
            create: sportIds.map((sportId: string) => ({
              sport: { connect: { id: sportId } }
            }))
          }
        })
      }
    });
  }

  async deleteVenue(id: string) {
    return prisma.venue.delete({ where: { id } });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }
}
