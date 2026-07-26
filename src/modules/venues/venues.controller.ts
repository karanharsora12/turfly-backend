import { Request, Response, NextFunction } from 'express';
import { VenuesService } from './venues.service';
import { sendResponse } from '../../utils/response';
import { z } from 'zod';

const venueSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  images: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  sportIds: z.array(z.string()).optional(),
});

export class VenuesController {
  private venuesService = new VenuesService();

  searchVenues = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, lat, lng, distance } = req.query;
      
      const searchParams = {
        query: q as string,
        latitude: lat ? parseFloat(lat as string) : undefined,
        longitude: lng ? parseFloat(lng as string) : undefined,
        distanceInKm: distance ? parseFloat(distance as string) : 10,
      };

      const venues = await this.venuesService.searchVenues(searchParams);
      return sendResponse(res, 200, true, 'Venues fetched successfully', venues);
    } catch (error) {
      next(error);
    }
  };

  getVenueById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const venue = await this.venuesService.getVenueById(id);
      if (!venue) return sendResponse(res, 404, false, 'Venue not found');
      return sendResponse(res, 200, true, 'Venue fetched successfully', venue);
    } catch (error) {
      next(error);
    }
  };

  createVenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = venueSchema.parse(req.body);
      const venue = await this.venuesService.createVenue(validatedData);
      return sendResponse(res, 201, true, 'Venue created successfully', venue);
    } catch (error) {
      next(error);
    }
  };

  updateVenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const validatedData = venueSchema.partial().parse(req.body);
      const venue = await this.venuesService.updateVenue(id, validatedData);
      return sendResponse(res, 200, true, 'Venue updated successfully', venue);
    } catch (error) {
      next(error);
    }
  };

  deleteVenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      await this.venuesService.deleteVenue(id);
      return sendResponse(res, 200, true, 'Venue deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
