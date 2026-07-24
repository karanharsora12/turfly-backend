import prisma from '../../utils/prisma';

export class ReviewsService {
  async createReview(reviewerId: string, data: any) {
    if (reviewerId === data.reviewedUserId) {
      const error: any = new Error('You cannot review yourself');
      error.statusCode = 400;
      throw error;
    }

    // Check if reviewer and reviewedUser were both approved participants in the meetup
    const participants = await prisma.participant.findMany({
      where: {
        meetupId: data.meetupId,
        userId: { in: [reviewerId, data.reviewedUserId] },
        status: 'APPROVED' // Only approved participants can review each other
      }
    });

    if (participants.length !== 2) {
      const error: any = new Error('Both users must be approved participants of the meetup to leave a review');
      error.statusCode = 400;
      throw error;
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId,
        reviewedUserId: data.reviewedUserId,
        meetupId: data.meetupId
      }
    });

    if (existingReview) {
      const error: any = new Error('You have already reviewed this user for this meetup');
      error.statusCode = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          ...data,
          reviewerId
        }
      });

      // Update User's average rating
      const allReviews = await tx.review.findMany({
        where: { reviewedUserId: data.reviewedUserId },
        select: { rating: true }
      });

      const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

      await tx.user.update({
        where: { id: data.reviewedUserId },
        data: { rating: avgRating }
      });

      return review;
    });
  }

  async getUserReviews(userId: string) {
    return prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: {
          select: { id: true, fullName: true, profileImage: true }
        },
        meetup: {
          select: { id: true, title: true, date: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
