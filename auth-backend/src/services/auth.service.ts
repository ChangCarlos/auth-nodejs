import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { AppError } from "../middlewares/error.middleware";

type RegisterInput = {
    name: string;
    email: string;
    password: string;
}

const userSelect = {
    id: true,
    name: true,
    email: true,
};

export class AuthService {
    static async register({ name, email, password }: RegisterInput) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new AppError('User already exists', 400);

        const passwordHash = await hashPassword(password);
        return prisma.user.create({
            data: { name, email, password: passwordHash },
            select: userSelect,
        });
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new AppError('Invalid credentials', 401);

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

        return { id: user.id, name: user.name, email: user.email };
    }

    static async getUserById(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: userSelect,
        });
    }
}