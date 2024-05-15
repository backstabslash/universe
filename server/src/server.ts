import http from 'http';
import { Server, Socket } from 'socket.io';
import app from './app';
import { api, db, client } from './config/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendMessage } from './handlers/messages';
import mongoose from 'mongoose';
import { getEnvVar } from './utils/utils';
import User from './models/user/userModel';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: client.url,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  },
});

io.use(async (socket: any, next) => {
  const refreshToken = socket.handshake.auth.refreshToken;
  if (!refreshToken) {
    return next(new Error('authentication error'));
  }
  const decoded = jwt.verify(
    refreshToken,
    getEnvVar('REFRESH_TOKEN_SECRET')
  ) as JwtPayload;

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new Error('no such user'));
  }

  socket.userId = decoded.userId;
  next();
});

io.on('connection', (socket: Socket) => {
  console.info('User connected');

  sendMessage(socket);

  socket.on('disconnect', () => {
    console.info('User disconnected');
  });
});

(async () => {
  try {
    server.listen(api.port, () => {
      console.info(`Server started on ${api.port}`);
    });

    if (!db.mongoUri) {
      throw new Error('Mongo URI is not provided');
    }
    await mongoose.connect(db.mongoUri);

    console.info('MongoDB connected');
  } catch (error) {
    console.error(error);
  }
})();
