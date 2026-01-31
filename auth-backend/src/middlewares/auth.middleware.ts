import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET!,
        );

        req.userId = (decoded as jwt.JwtPayload).sub;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}