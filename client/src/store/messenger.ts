import io, { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { api } from '../config/config';

export interface ChannelGroups {
  name: string;
  items: Channel[];
}

export interface Channel {
  id: string;
  name: string;
  content: {
    messages: any[];
  };
}

interface MessengerState {
  socket: Socket | null;
  channelGroups: ChannelGroups[];
  currentChannel: Channel | null;
  error: typeof Error | null;
  connectSocket: () => void;
  getChannelGroups: () => void;
  setCurrentChannel: (channel: Channel) => void;
  getChannelMessages: (channel: Channel) => void;
}

const useMessengerStore = create<MessengerState>((set, get) => ({
  socket: null,
  channelGroups: [],
  currentChannel: null,
  error: null,

  connectSocket: () => {
    try {
      const socket = io(api.url, {
        withCredentials: true,
      });
      set({ socket, error: null });
    } catch (error: any) {
      set({ error });
    }
  },

  getChannelGroups: () => {
    try {
      const socket = get().socket;
      socket?.once('send-channels', channels => {
        set({ channelGroups: channels, error: null });
        console.log(channels);
      });
    } catch (error: any) {
      set({ error });
    }
  },

  sendMessage: (message: string) => {
    try {
      const socket = get().socket;
      socket?.emit('send-message', message);
    } catch (error: any) {
      set({ error });
    }
  },

  setCurrentChannel: (channel: Channel) => {
    set({ currentChannel: channel });
  },

  getChannelMessages: (channel: Channel) => {
    try {
      const socket = get().socket;
      socket?.emit('get-channel-messages', channel.id);
    } catch (error: any) {
      set({ error });
    }
  },
}));

export default useMessengerStore;
