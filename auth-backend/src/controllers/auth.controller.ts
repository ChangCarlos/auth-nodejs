import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";


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
                path: '/auth/refresh',
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
}