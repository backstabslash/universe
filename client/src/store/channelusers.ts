import { create } from 'zustand';
import { api } from '../config/config';

interface ChannelUsersState {
  channelUsers: any;
  fetchUserDetails: any;
  axios: any;
  setAxiosPrivate: any;
  addUserToChannel: any;
}

const useChannelUsersStore = create<ChannelUsersState>((set, get: any) => ({
  channelUsers: {},
  axios: null,

  setAxiosPrivate: async (axiosPrivate: any) => {
    set({ axios: axiosPrivate });
  },

  fetchUserDetails: async (userId: string) => {
    try {
      const { axios } = get();
      const response = await axios?.get(`${api.url}/user/get-by-id/${userId}`);
      const users = { ...get().channelUsers, [userId]: response.data };
      set({ channelUsers: users });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user details:', error);
      throw Error(error);
    }
  },

  addUserToChannel: async (channelId: string, id: string) => {
    try {
      const { axios } = get();
      await axios?.post(`${api.url}/channel/add-user`, { channelId, id });
      const users = {
        ...get().channelUsers,
        [id]: { ...get().channelUsers[id], channelId },
      };
      set({ channelUsers: users });
    } catch (error: any) {
      console.error('Failed to add user to channel:', error);
      throw Error(error);
    }
  },
}));

export default useChannelUsersStore;
