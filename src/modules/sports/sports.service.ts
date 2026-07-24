import prisma from '../../utils/prisma';

export class SportsService {
  async getAllSports() {
    return prisma.sport.findMany();
  }

  async getSportById(id: string) {
    return prisma.sport.findUnique({ where: { id } });
  }

  async createSport(data: any) {
    return prisma.sport.create({ data });
  }

  async updateSport(id: string, data: any) {
    return prisma.sport.update({ where: { id }, data });
  }

  async deleteSport(id: string) {
    return prisma.sport.delete({ where: { id } });
  }
}
