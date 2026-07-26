import { Request, Response, NextFunction } from "express";
import { MeetupsService } from "./meetups.service";
import { sendResponse } from "../../utils/response";
import { z } from "zod";
import { AuthRequest } from "../../middlewares/auth.middleware";

const meetupSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  date: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  skillLevel: z.string().optional(),
  maximumPlayers: z.number().int().positive(),
  entryFee: z.number().nonnegative().optional(),
  isPublic: z.boolean().optional(),
  sportId: z.string().uuid(),
  venueId: z.string().uuid().optional(),
});

export class MeetupsController {
  private meetupsService = new MeetupsService();

  searchMeetups = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchParams = {
        sportId: req.query.sportId as string,
        date: req.query.date as string,
        latitude: req.query.lat
          ? parseFloat(req.query.lat as string)
          : undefined,
        longitude: req.query.lng
          ? parseFloat(req.query.lng as string)
          : undefined,
        distanceInKm: req.query.distance
          ? parseFloat(req.query.distance as string)
          : 20,
      };

      const meetups = await this.meetupsService.searchMeetups(searchParams);
      return sendResponse(
        res,
        200,
        true,
        "Meetups fetched successfully",
        meetups,
      );
    } catch (error) {
      next(error);
    }
  };

  getMeetupById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const meetup = await this.meetupsService.getMeetupById(id);
      if (!meetup) return sendResponse(res, 404, false, "Meetup not found");
      return sendResponse(
        res,
        200,
        true,
        "Meetup fetched successfully",
        meetup,
      );
    } catch (error) {
      next(error);
    }
  };

  createMeetup = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validatedData = meetupSchema.parse(req.body);
      const meetup = await this.meetupsService.createMeetup(
        req.user!.id,
        validatedData,
      );
      return sendResponse(
        res,
        201,
        true,
        "Meetup created successfully",
        meetup,
      );
    } catch (error) {
      next(error);
    }
  };

  updateMeetup = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params as { id: string };
      const validatedData = meetupSchema.partial().parse(req.body);

      const meetup = await this.meetupsService.updateMeetup(
        id,
        req.user!.id,
        req.user!.role,
        validatedData,
      );
      return sendResponse(
        res,
        200,
        true,
        "Meetup updated successfully",
        meetup,
      );
    } catch (error) {
      next(error);
    }
  };

  deleteMeetup = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params as { id: string };
      await this.meetupsService.deleteMeetup(id, req.user!.id, req.user!.role);
      return sendResponse(res, 200, true, "Meetup deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
