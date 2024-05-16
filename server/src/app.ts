import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions';
import credentials from './middleware/credentials';
import verifyJWT from './middleware/verify-jwt';
import userRoutes from './routes/userRoutes';
import channelRoutes from './routes/channelRoutes';
import EmailService from './email-service/emailService';
require('dotenv').config();

const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use(verifyJWT);
app.use('/user', userRoutes);
app.use('/channel', channelRoutes);

export default app;
