import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';
import { config } from '../../config';

export class AuthService {
  async register(data: any) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    });

    if (existingUser) {
      const error: any = new Error('User with this email or username already exists');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return user;
  }

  async login(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken,
        isOnline: true,
        lastSeen: new Date()
      }
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { id: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error();
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        { id: user.id },
        config.JWT_REFRESH_SECRET,
        { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken }
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (err) {
      const error: any = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        refreshToken: null,
        isOnline: false,
        lastSeen: new Date()
      }
    });
  }
}
