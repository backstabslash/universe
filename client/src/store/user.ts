import { create } from 'zustand';
import { api } from '../config/config';
import { AxiosInstance } from 'axios';

interface UserData {
  userId?: string | null;
  email?: string | null;
  accessToken?: string | null;
  tag?: string | null;
  password?: string | null;
  verifyCode?: string | null;
  name?: string | null;
  pfp_url?: string | null;
  phone?: string | null;
}

interface UserState {
  userData: UserData | null;
  axios: AxiosInstance | null;
  error: any;
  setAxiosPrivate: (axiosPrivate: AxiosInstance) => Promise<void>;
  fetchUserByEmail: () => Promise<void>;
  fetchUserById: (userData: UserData) => Promise<void>;
  updateUserInfo: (updateData: UserData) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  userData: null,
  axios: null,
  error: null,

  setAxiosPrivate: async axiosPrivate => {
    set({ axios: axiosPrivate });
  },

  fetchUserByEmail: async () => {
    try {
      const { axios } = get();
      const response = await axios?.get(`${api.url}/user/get-by-email`);
      set({ userData: response?.data });
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      set({ error: error.response?.data?.message || 'Failed to fetch user' });
      throw Error(error);
    }
  },
  fetchUserById: async () => {
    try {
      const { axios } = get();
      const response = await axios?.get(`${api.url}/user/get-by-id`);
      set({ userData: response?.data });
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      set({ error: error.response?.data?.message || 'Failed to fetch user' });
      throw Error(error);
    }
  },
  updateUserInfo: async (updateData: UserData) => {
    try {
      const { axios } = get();
      const response = await axios?.put(`${api.url}/user/user`, updateData);
      set(state => ({
        userData: { ...state.userData, ...response?.data },
      }));
    } catch (error: any) {
      console.error('Failed to update user:', error);
      set({ error: error.response?.data?.message || 'Failed to update user' });
      throw Error(error);
    }
  },
}));

export default useUserStore;
