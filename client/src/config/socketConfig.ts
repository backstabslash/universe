import io, { Socket } from 'socket.io-client';
import { api } from './config';

const connectSocket = (): Socket => {
  const socket = io(api.url, {
    withCredentials: true,
  });
  return socket;
};

export default connectSocket;
