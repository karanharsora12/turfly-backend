import { ParticipantStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

export class ParticipantsService {
  async joinMeetup(userId: string, meetupId: string) {
    const meetup = await prisma.meetup.findUnique({
      where: { id: meetupId },
      include: { participants: true },
    });

    if (!meetup) {
      const error: any = new Error("Meetup not found");
      error.statusCode = 404;
      throw error;
    }

    if (meetup.status !== "OPEN") {
      const error: any = new Error("Meetup is not open for joining");
      error.statusCode = 400;
      throw error;
    }

    const existingParticipant = meetup.participants.find(
      (p) => p.userId === userId,
    );
    if (existingParticipant) {
      const error: any = new Error(
        "You have already joined or requested to join this meetup",
      );
      error.statusCode = 400;
      throw error;
    }

    let status: ParticipantStatus = "PENDING";

    if (meetup.isPublic) {
      if (meetup.currentPlayers < meetup.maximumPlayers) {
        status = "APPROVED";
      } else {
        status = "WAITLISTED";
      }
    }

    return prisma.$transaction(async (tx) => {
      const participant = await tx.participant.create({
        data: {
          userId,
          meetupId,
          status,
        },
      });

      if (status === "APPROVED") {
        await tx.meetup.update({
          where: { id: meetupId },
          data: { currentPlayers: { increment: 1 } },
        });

        // Add to group chat
        const chat = await tx.chat.findUnique({ where: { meetupId } });
        if (chat) {
          await tx.chatParticipant.create({
            data: { chatId: chat.id, userId },
          });
        }
      }

      return participant;
    });
  }

  async leaveMeetup(userId: string, meetupId: string) {
    const participant = await prisma.participant.findUnique({
      where: { userId_meetupId: { userId, meetupId } },
    });

    if (!participant) {
      const error: any = new Error("You are not a participant in this meetup");
      error.statusCode = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      await tx.participant.delete({
        where: { userId_meetupId: { userId, meetupId } },
      });

      if (participant.status === "APPROVED") {
        await tx.meetup.update({
          where: { id: meetupId },
          data: { currentPlayers: { decrement: 1 } },
        });

        // Remove from chat
        const chat = await tx.chat.findUnique({ where: { meetupId } });
        if (chat) {
          await tx.chatParticipant.deleteMany({
            where: { chatId: chat.id, userId },
          });
        }
      }
    });
  }

  async updateParticipantStatus(
    meetupId: string,
    targetUserId: string,
    hostId: string,
    status: ParticipantStatus,
  ) {
    const meetup = await prisma.meetup.findUnique({ where: { id: meetupId } });

    if (!meetup) {
      const error: any = new Error("Meetup not found");
      error.statusCode = 404;
      throw error;
    }

    if (meetup.hostId !== hostId) {
      const error: any = new Error("Only the host can manage participants");
      error.statusCode = 403;
      throw error;
    }

    const participant = await prisma.participant.findUnique({
      where: { userId_meetupId: { userId: targetUserId, meetupId } },
    });

    if (!participant) {
      const error: any = new Error("Participant not found");
      error.statusCode = 404;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const updatedParticipant = await tx.participant.update({
        where: { userId_meetupId: { userId: targetUserId, meetupId } },
        data: { status },
      });

      // Handle logic if status changed TO or FROM Approved
      if (participant.status !== "APPROVED" && status === "APPROVED") {
        await tx.meetup.update({
          where: { id: meetupId },
          data: { currentPlayers: { increment: 1 } },
        });

        const chat = await tx.chat.findUnique({ where: { meetupId } });
        if (chat) {
          await tx.chatParticipant.create({
            data: { chatId: chat.id, userId: targetUserId },
          });
        }
      } else if (
        participant.status === "APPROVED" &&
        (status === "REJECTED" || status === "KICKED")
      ) {
        await tx.meetup.update({
          where: { id: meetupId },
          data: { currentPlayers: { decrement: 1 } },
        });

        const chat = await tx.chat.findUnique({ where: { meetupId } });
        if (chat) {
          await tx.chatParticipant.deleteMany({
            where: { chatId: chat.id, userId: targetUserId },
          });
        }
      }

      return updatedParticipant;
    });
  }
}
