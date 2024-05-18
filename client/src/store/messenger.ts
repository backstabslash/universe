import io, { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { api } from '../config/config';
import { Descendant } from 'slate';

export interface ChannelGroup {
  name: string;
  items: Array<Omit<Channel, 'messages'>>;
}

export interface ChannelMessages extends Channel {
  id: string;
  name: string;
  messages: UserMessage[];
}

export interface Channel {
  id: string;
  name: string;
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

export type MessageTextContent = Descendant & {
  children: any[];
  type: string;
};

interface SocketResponse {
  status: string;
  message: string;
}

interface MessengerState {
  socket: Socket | null;
  channelGroups: ChannelGroup[];
  channels: ChannelMessages[];
  currentChannel: Omit<Channel, 'messages'> | null;
  error: typeof Error | null;
  connectSocket: () => void;
  getChannelGroups: () => void;
  setCurrentChannel: (channel: Channel) => void;
  getChannelMessages: (channelId: string) => void;
  sendMessage: (message: any) => void;
  recieveMessage: () => void;
}

const useMessengerStore = create<MessengerState>((set, get) => ({
  socket: null,
  channelGroups: [],
  channels: [],
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
      const { socket } = get();

      socket?.once('send-channels', channelGroups => {
        const channels = channelGroups.flatMap((channelGroup: ChannelGroup) => {
          return channelGroup.items;
        });

        set({ channelGroups, channels, error: null });
      });
    } catch (error: any) {
      set({ error });
    }
  },

  sendMessage: (message: UserMessage) => {
    const { socket, currentChannel, channels } = get();

    if (!socket || !currentChannel?.id) {
      return;
    }

    const newMessage = {
      ...message,
      status: MessageStatus.SENDING,
      sendAt: Date.now(),
    };

    let messageLink: UserMessage | undefined;
    for (const channel of channels) {
      if (channel.id === currentChannel?.id) {
        const messagesLength = channel.messages.push(newMessage);
        messageLink = channel.messages[messagesLength - 1];
      }
    }

    if (!messageLink) {
      return;
    }
    set({ channels: [...channels] });

    const timeout = setTimeout(() => {
      messageLink.status = MessageStatus.FAILED;
      set({ channels: [...channels] });
    }, 10000);

    socket.emit(
      'send-message',
      {
        message: newMessage,
        channelId: currentChannel.id,
      },
      (response: SocketResponse) => {
        clearTimeout(timeout);

        if (response.status === 'error') {
          messageLink.status = MessageStatus.FAILED;
          set({
            channels: [...channels],
          });
        }
        if (response.status === 'success') {
          messageLink.status = MessageStatus.SUCCESS;
          set({ channels: [...channels] });
        }
      }
    );
  },

  recieveMessage: () => {
    try {
      const { currentChannel, channels, socket } = get();

      const onRecieveMessage = (message: any): void => {
        for (const channel of channels) {
          if (channel.id === currentChannel?.id) {
            channel.messages.push(message);
          }
        }

        set({ channels: [...channels], error: null });
      };

      socket?.on('recieve-message', onRecieveMessage);
    } catch (error: any) {
      set({ error });
    }
  },

  setCurrentChannel: (channel: Channel) => {
    set({
      currentChannel: {
        id: channel.id,
        name: channel.name,
      },
    });
  },

  getChannelMessages: (channelId: string): void => {
    try {
      const { socket, channels } = get();

      const onRecieveChannelMessages = (messages: UserMessage[]): void => {
        for (const channel of channels) {
          if (channel.id === channelId) {
            channel.messages = messages;
          }
        }
        set({ channels: [...channels], error: null });
      };
      socket?.once('recieve-channel-messages', onRecieveChannelMessages);
      socket?.emit('get-channel-messages', { channelId });
    } catch (error: any) {
      set({ error });
    }
  },
}));

export default useMessengerStore;
