import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware';

export const app = express();

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}),
);
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(errorHandler);