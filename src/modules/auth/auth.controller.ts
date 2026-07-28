import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendResponse } from '../../utils/response';
import { registerSchema, loginSchema, refreshTokenSchema, verifyOTPSchema } from './auth.validation';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await this.authService.register(validatedData);
      return sendResponse(res, 201, true, 'User registered successfully', user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const tokens = await this.authService.login(validatedData);
      return sendResponse(res, 200, true, 'Logged in successfully', tokens);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = refreshTokenSchema.parse(req.body);
      const tokens = await this.authService.refreshAccessToken(token);
      return sendResponse(res, 200, true, 'Token refreshed successfully', tokens);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body; // In real app, extract from authenticated user token
      if(userId) {
        await this.authService.logout(userId);
      }
      return sendResponse(res, 200, true, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  };

  generateOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const result = await this.authService.generateOTP(email);

      return sendResponse(
        res,
        200,
        true,
        "OTP sent successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  };

  verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = verifyOTPSchema.parse(req.body);

      const result = await this.authService.verifyOTP(email, otp);

      return sendResponse(
        res,
        200,
        true,
        "OTP verified successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  };
}
