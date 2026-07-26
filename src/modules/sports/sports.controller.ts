import { Request, Response, NextFunction } from 'express';
import { SportsService } from './sports.service';
import { sendResponse } from '../../utils/response';
import { z } from 'zod';

const sportSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export class SportsController {
  private sportsService = new SportsService();

  getAllSports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sports = await this.sportsService.getAllSports();
      return sendResponse(res, 200, true, 'Sports fetched successfully', sports);
    } catch (error) {
      next(error);
    }
  };

  getSportById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const sport = await this.sportsService.getSportById(id);
      if (!sport) return sendResponse(res, 404, false, 'Sport not found');
      return sendResponse(res, 200, true, 'Sport fetched successfully', sport);
    } catch (error) {
      next(error);
    }
  };

  createSport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = sportSchema.parse(req.body);
      const sport = await this.sportsService.createSport(validatedData);
      return sendResponse(res, 201, true, 'Sport created successfully', sport);
    } catch (error) {
      next(error);
    }
  };

  updateSport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const validatedData = sportSchema.partial().parse(req.body);
      const sport = await this.sportsService.updateSport(id, validatedData);
      return sendResponse(res, 200, true, 'Sport updated successfully', sport);
    } catch (error) {
      next(error);
    }
  };

  deleteSport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      await this.sportsService.deleteSport(id);
      return sendResponse(res, 200, true, 'Sport deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
