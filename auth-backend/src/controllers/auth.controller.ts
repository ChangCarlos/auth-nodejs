import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { AppError } from "../middlewares/error.middleware";
import { COOKIE_CONFIG } from "../config/constants";

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const user = await AuthService.register({ name, email, password });

            res.status(201).json({
                message: 'User registered successfully',
                user: { name: user.name, email: user.email },
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const user = await AuthService.login(email, password);

            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            res.cookie('refreshToken', refreshToken, COOKIE_CONFIG);
            res.json({ message: 'Login successful', user: { email: user.email }, accessToken });
        } catch (error) {
            next(new AppError('Invalid credentials', 401));
        }
    }

    static async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw new AppError('Refresh token missing', 401);

            const { sub: userId } = verifyRefreshToken(refreshToken);
            const newAccessToken = generateAccessToken(userId);
            const newRefreshToken = generateRefreshToken(userId);

            res.cookie('refreshToken', newRefreshToken, COOKIE_CONFIG);
            res.json({ accessToken: newAccessToken });
        } catch {
            next(new AppError('Invalid refresh token', 401));
        }
    }

    static logout(_: Request, res: Response) {
        res.clearCookie('refreshToken', { path: COOKIE_CONFIG.path });
        res.status(204).send();
    }

    static async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.userId) throw new AppError('Unauthorized', 401);

            const user = await AuthService.getUserById(req.userId);
            if (!user) throw new AppError('User not found', 404);

            res.json({ user });
        } catch (error) {
            next(error);
        }
    }
}