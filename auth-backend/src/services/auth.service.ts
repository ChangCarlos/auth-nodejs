import { id, th } from "zod/locales";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


type RegisterInput = {
    name: string;
    email: string;
    password: string;
}

export class AuthService {
    static async register({ name, email, password }: RegisterInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            },
        });

        return user;
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }

    static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return user;
    }
}