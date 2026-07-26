import { Response, NextFunction } from "express";
import { ParticipantsService } from "./participants.service";
import { sendResponse } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { z } from "zod";
import { ParticipantStatus } from "../../../generated/prisma";

const updateStatusSchema = z.object({
  status: z.enum([
    ParticipantStatus.APPROVED,
    ParticipantStatus.REJECTED,
    ParticipantStatus.KICKED,
  ]),
});

export class ParticipantsController {
  private participantsService = new ParticipantsService();

  joinMeetup = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { meetupId } = req.params as { meetupId: string };
      const participant = await this.participantsService.joinMeetup(
        req.user!.id,
        meetupId,
      );
      return sendResponse(
        res,
        201,
        true,
        "Join request sent successfully",
        participant,
      );
    } catch (error) {
      next(error);
    }
  };

  leaveMeetup = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { meetupId } = req.params as { meetupId: string };
      await this.participantsService.leaveMeetup(req.user!.id, meetupId);
      return sendResponse(res, 200, true, "Left meetup successfully");
    } catch (error) {
      next(error);
    }
  };

  updateParticipantStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { meetupId, userId } = req.params as {
        meetupId: string;
        userId: string;
      };
      const { status } = updateStatusSchema.parse(req.body);

      const participant =
        await this.participantsService.updateParticipantStatus(
          meetupId,
          userId,
          req.user!.id,
          status,
        );

      return sendResponse(
        res,
        200,
        true,
        `Participant status updated to ${status}`,
        participant,
      );
    } catch (error) {
      next(error);
    }
  };
}
