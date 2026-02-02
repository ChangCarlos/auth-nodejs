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
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload;
        req.userId = decoded.sub;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}