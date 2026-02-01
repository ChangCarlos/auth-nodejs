import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";


export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const user = await AuthService.register({
                name,
                email,
                password,
            });

            return res.status(201).json({
                message: 'User registered successfully',
                user: {
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const { user, accessToken, refreshToken } = await AuthService.login(email, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/refresh',
            });

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    email: user.email,
                },
                accessToken,
            });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    }

    static async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
        }

        try {
        const { sub: userId } = verifyRefreshToken(refreshToken);

        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/auth/refresh',
        });

        return res.json({
            accessToken: newAccessToken,
        });
        } catch {
        return res.status(401).json({ message: 'Invalid refresh token' });
        }
    }

    static async logout(_: Request, res: Response) {
        res.clearCookie('refreshToken', {
        path: '/auth/refresh',
        });

        return res.status(204).send();
    }

    static async getMe(req: Request, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await AuthService.getUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}