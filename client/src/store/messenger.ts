import io, { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { api } from '../config/config';
import { Descendant } from 'slate';

export interface ChannelGroup {
  name: string;
  items: Channel[];
}

export interface Channel {
  id: string;
  name: string;
  content: {
    messages: UserMessage[];
  };
}

export type UserMessage = Message & MessageInfo;

export interface MessageInfo {
  user: { id: string; name: string };
  sendAt: number;
}

export interface Message {
  textContent: MessageTextContent[];
  status: MessageStatus;
}

export enum MessageStatus {
  SENDING,
  FAILED,
  SUCCESS,
}

type MessageTextContent = Descendant & {
  children: any[];
};

interface SocketResponse {
  status: string;
  message: string;
}

interface MessengerState {
  socket: Socket | null;
  channelGroups: ChannelGroup[];
  currentGroupName: string | null;
  currentChannelId: string | null;
  error: typeof Error | null;
  connectSocket: () => void;
  getChannelGroups: () => void;
  setCurrentGroupAndChannel: (channelGroup: string, channel: string) => void;
  getChannelMessages: (channelId: string) => void;
  sendMessage: (message: any) => void;
  recieveMessage: () => void;
}

const useMessengerStore = create<MessengerState>((set, get) => ({
  socket: null,
  channelGroups: [],
  currentChannelId: null,
  currentGroupName: null,
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

      socket?.once('send-channels', channelGroups => {
        set({ channelGroups, error: null });
      });
    } catch (error: any) {
      set({ error });
    }
  },

  sendMessage: (message: Message) => {
    const { socket, currentChannelId, channelGroups } = get();

    if (!socket || !currentChannelId) {
      return;
    }

    let tempMessage: Message;
    for (const channelGroup of channelGroups) {
      for (const channel of channelGroup.items) {
        if (channel.id === currentChannelId) {
          const messagesLength = channel.content.messages.push({
            textContent: message.textContent,
            status: MessageStatus.SENDING,
            user: {
              id: '',
              name: '',
            },
            sendAt: 0,
          });
          tempMessage = channel.content.messages[messagesLength - 1];
        }
      }
    }
    set({ channelGroups: [...channelGroups] });

    const timeout = setTimeout(() => {
      tempMessage.status = MessageStatus.FAILED;
      set({ channelGroups: [...channelGroups] });
    }, 10000);

    socket.emit(
      'send-message',
      {
        message: {
          textContent: message.textContent,
        },
        channelId: currentChannelId,
      },
      (response: SocketResponse) => {
        clearTimeout(timeout);

        if (response.status === 'error') {
          tempMessage.status = MessageStatus.FAILED;
          set({
            channelGroups: [...channelGroups],
          });
        }
        if (response.status === 'success') {
          tempMessage.status = MessageStatus.SUCCESS;
          set({ channelGroups: [...channelGroups] });
        }
      }
    );
  },

  recieveMessage: () => {
    try {
      const socket = get().socket;

      const onRecieveMessage = (message: any): void => {
        console.log('recieve-message', message);
        const currentChannelId = get().currentChannelId;
        const channelGroups = get().channelGroups;

        for (const channelGroup of channelGroups) {
          for (const channel of channelGroup.items) {
            if (channel.id === currentChannelId) {
              channel.content.messages.push(message);
            }
          }
        }

        set({ channelGroups: [...channelGroups], error: null });
      };

      socket?.on('recieve-message', onRecieveMessage);
    } catch (error: any) {
      set({ error });
    }
  },

  setCurrentGroupAndChannel: (channelGroupName: string, channelId: string) => {
    set({ currentGroupName: channelGroupName });
    set({ currentChannelId: channelId });
  },

  getChannelMessages: (channelId: string): void => {
    try {
      const socket = get().socket;
      const channelGroups = get().channelGroups;

      const onRecieveChannelMessages = (messages: any[]): void => {
        for (const channelGroup of channelGroups) {
          for (const channel of channelGroup.items) {
            if (channel.id === channelId) {
              channel.content.messages = messages;
            }
          }
        }

        set({ channelGroups: [...channelGroups], error: null });
      };

      socket?.once('recieve-channel-messages', onRecieveChannelMessages);
      socket?.emit('get-channel-messages', { channelId });
    } catch (error: any) {
      set({ error });
    }
  },
}));

export default useMessengerStore;
