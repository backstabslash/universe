import io, { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { api } from '../config/config';
import { Descendant } from 'slate';

export interface ChannelGroup {
  name: string;
  items: Array<Omit<Channel, 'messages'>>;
}
export interface DmWithUser {
  channel: string;
  user: { _id: string, name: string, pfp_url: string };
}

export interface ChannelMessages extends Channel {
  id: string;
  messages: UserMessage[];
  page: number;
  users: any;
}

export interface Channel {
  id: string;
  name: string;
  user?: { _id?: string };
}

export type UserMessage = Message & MessageInfo;

export interface MessageInfo {
  id: string;
  user: { _id: string; name: string };
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
  dmsWithUsers: DmWithUser[];
  channels: ChannelMessages[];
  lastSentMessage: {
    message: UserMessage | null;
    channelId: string;
  };
  currentChannel: Omit<Channel, 'messages'> | null;
  error: typeof Error | null;
  connectSocket: () => void;
  getChannelGroups: () => void;
  setCurrentChannel: (id: string, name: string, userId?: string) => void;
  loadChannelMessages: () => void;
  sendMessage: (message: any) => void;
  recieveMessage: () => void;
  onRecieveChannelMessages: (data: {
    messages: UserMessage[];
    users: any;
  }) => void;
}

const useMessengerStore = create<MessengerState>((set, get) => ({
  socket: null,
  channelGroups: [],
  dmsWithUsers: [],
  channels: [],
  currentChannel: null,
  error: null,
  lastSentMessage: {
    message: null,
    channelId: '',
  },

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

      if (!socket) return;

      socket.once('send-channels', data => {
        const channels = data.channelGroups.flatMap((channelGroup: ChannelGroup) => {
          return channelGroup.items;
        });
        channels.push(...data.dmsWithUsers.map((dm: DmWithUser) => { return { id: dm.channel } }))

        set({ channelGroups: data.channelGroups, dmsWithUsers: data.dmsWithUsers, channels, error: null });
      });
    } catch (error: any) {
      set({ error });
    }
  },

  sendMessage: (message: UserMessage) => {
    const { socket, currentChannel, channels, dmsWithUsers } = get();

    if (!socket || !currentChannel) return;

    const newMessage = {
      ...message,
      id: generateObjectId(),
      status: MessageStatus.SENDING,
      sendAt: Date.now(),
    };

    let messageLink: UserMessage | undefined;
    for (const channel of channels) {
      if (channel.id === currentChannel.id) {
        if (!channel.messages) {
          channel.messages = [];
        }
        channel.messages.unshift(newMessage);
        messageLink = channel.messages[0];
      }
    }

    if (!messageLink) {
      return;
    }
    set({
      channels: [...channels],
      lastSentMessage: {
        message: messageLink,
        channelId: currentChannel.id,
      },
    });

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
        const updatedDm = dmsWithUsers.find(dm => dm.channel === currentChannel.id)
        const updatedDmIndex = dmsWithUsers.findIndex(dm => dm.channel === currentChannel.id)
        if (updatedDm) {
          dmsWithUsers.splice(updatedDmIndex, 1)
          set({ dmsWithUsers: [updatedDm, ...dmsWithUsers] })
        }
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
      const { socket } = get();

      if (!socket) return;

      socket.on(
        'receive-message',
        (data: { channelId: string; message: UserMessage }): void => {
          const { channels, dmsWithUsers } = get();

          const updatedChannels = channels.map(channel => {
            if (channel.id === data.channelId) {
              if (!channel.messages) {
                channel.messages = []
              }
              return {
                ...channel,
                messages: [data.message, ...channel.messages],
              };
            }
            return channel;
          });
          const updatedDm = dmsWithUsers.find(dm => dm.channel === data.channelId)
          const updatedDmIndex = dmsWithUsers.findIndex(dm => dm.channel === data.channelId)
          if (updatedDm) {
            dmsWithUsers.splice(updatedDmIndex, 1)
            set({ dmsWithUsers: [updatedDm, ...dmsWithUsers] })
          }
          console.log('goidaSVO');

          set({
            channels: updatedChannels,
            lastSentMessage: {
              ...data,
            },
            error: null,
          });
        }
      );
    } catch (error: any) {
      set({ error });
    }
  },

  setCurrentChannel: (id: string, name: string, userId?: string) => {
    set({
      currentChannel: {
        id,
        name,
        user: { _id: userId },
      },
    });
  },

  loadChannelMessages: (): void => {
    try {
      const { socket, channels, currentChannel } = get();

      if (!socket || !currentChannel) return;

      const currentPage =
        channels.find(channel => channel.id === currentChannel.id)?.page ?? 0;

      socket.emit('get-channel-messages', {
        channelId: currentChannel.id,
        limit: 20,
        page: currentPage,
      });
    } catch (error: any) {
      set({ error });
    }
  },

  onRecieveChannelMessages: (data: {
    messages: UserMessage[];
    users: any;
  }): void => {
    const { channels, currentChannel } = get();

    const updatedChannels = channels.map(channel => {
      if (channel.id === currentChannel?.id) {
        return {
          ...channel,
          messages: [...(channel?.messages || []), ...data.messages],
          page: channel.page ? channel.page + 1 : 1,
          users: data.users,
        };
      }
      return channel;
    });

    set({ channels: updatedChannels });
  },
}));

const generateObjectId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomBytes = [...Array(5)]
    .map(() =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    )
    .join('');
  const increment = Math.floor(Math.random() * 16777216)
    .toString(16)
    .padStart(6, '0');

  return timestamp + randomBytes + increment;
};

export default useMessengerStore;
