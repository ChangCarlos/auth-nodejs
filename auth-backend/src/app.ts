import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './routes/auth.routes';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}),
);
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes)