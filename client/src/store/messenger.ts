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
    users: { id: string; name: string }[];
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
  currentChannel: Omit<Channel, 'content'> | null;
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
        set({ channelGroups, error: null });
      });
    } catch (error: any) {
      set({ error });
    }
  },

  sendMessage: (message: Message) => {
    const { socket, currentChannel, channelGroups } = get();

    if (!socket || !currentChannel?.id) {
      return;
    }

    const newMessage = {
      textContent: message.textContent,
      status: MessageStatus.SENDING,
      user: {
        id: '',
        name: '',
      },
      sendAt: Date.now(),
    };

    let messageLink: UserMessage | undefined;
    for (const channelGroup of channelGroups) {
      for (const channel of channelGroup.items) {
        if (channel.id === currentChannel?.id) {
          const messagesLength = channel.content.messages.push(newMessage);
          messageLink = channel.content.messages[messagesLength - 1];
        }
      }
    }
    if (!messageLink) {
      return;
    }
    set({ channelGroups: [...channelGroups] });

    const timeout = setTimeout(() => {
      messageLink.status = MessageStatus.FAILED;
      set({ channelGroups: [...channelGroups] });
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
            channelGroups: [...channelGroups],
          });
        }
        if (response.status === 'success') {
          messageLink.status = MessageStatus.SUCCESS;
          set({ channelGroups: [...channelGroups] });
        }
      }
    );
  },

  recieveMessage: () => {
    try {
      const { currentChannel, channelGroups, socket } = get();

      const onRecieveMessage = (message: any): void => {
        for (const channelGroup of channelGroups) {
          for (const channel of channelGroup.items) {
            if (channel.id === currentChannel?.id) {
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
      const { socket, channelGroups } = get();

      const onRecieveChannelMessages = (data: {
        messages: any[];
        users: any[];
      }): void => {
        const { messages, users } = data;
        for (const channelGroup of channelGroups) {
          for (const channel of channelGroup.items) {
            if (channel.id === channelId) {
              channel.content.messages = messages;
              channel.content.users = users;
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
