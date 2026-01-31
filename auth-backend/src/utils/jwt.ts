import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_ACCESS_SECRET
const refreshSecret = process.env.JWT_REFRESH_SECRET

export function generateAccessToken(userId: string) {
    return jwt.sign({ sub: userId }, accessSecret!, {
        expiresIn: '15m',
    });
}

export function generateRefreshToken(userId: string) {
    return jwt.sign({ sub: userId }, refreshSecret!, {
        expiresIn: '7d',
    });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, accessSecret!);
}