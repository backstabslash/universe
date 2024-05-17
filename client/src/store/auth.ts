import { create } from 'zustand';
import axios from 'axios';
import { api } from '../config/config';

interface UserData {
  userId?: string | null;
  email?: string | null;
  accessToken?: string | null;
  password?: string | null;
  verifyCode?: string | null;
  name?: string | null;
}

interface AuthState {
  userData: UserData | null;
  error: any;
  refresh: () => Promise<string | null>;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  verify: (userData: UserData) => Promise<void>;
  register: (userData: UserData) => Promise<void>;
  setErrorNull: () => void;
}

const useAuthStore = create<AuthState>(set => ({
  userData: null,
  error: null,

  setErrorNull: () => {
    set({ error: null });
  },

  register: async (userData: UserData) => {
    try {
      await axios.post(`${api.url}/auth/register`, userData);
      set({ error: null });
    } catch (err: any) {
      const error =
        err.response?.data?.message ||
        err.message ||
        'An unknown error occurred';
      set({ error });
      throw error;
    }
  },

  verify: async (userData: UserData) => {
    try {
      await axios.post(`${api.url}/auth/verifyemail`, userData);
      set({ error: null });
    } catch (err: any) {
      const error =
        err.response?.data?.error || err.message || 'An unknown error occurred';
      set({ error });
    }
  },

  login: async (userData: UserData) => {
    try {
      const response = await axios.post(
        `${api.url}/auth/login`,
        {
          email: userData.email,
          password: userData.password,
        },
        { withCredentials: true }
      );
      set({ userData: response?.data?.accessToken, error: null });
    } catch (err: any) {
      const error =
        err.response?.data?.message ||
        err.message ||
        'An unknown error occurred';
      set({ userData: null, error });
      throw error;
    }
  },

  refresh: async () => {
    try {
      const response = await axios.get(`${api.url}/auth/refresh`, {
        withCredentials: true,
      });
      set({ userData: response?.data, error: null });
      return response?.data?.accessToken;
    } catch (err: any) {
      const error =
        err.response?.data?.message ||
        err.message ||
        'An unknown error occurred';
      set({ error });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.get(`${api.url}/auth/logout`, {
        withCredentials: true,
      });
      set({ userData: null, error: null });
    } catch (err: any) {
      const error =
        err.response?.data?.message ||
        err.message ||
        'An unknown error occurred';
      set({ error });
      throw error;
    }
  },
}));

export default useAuthStore;
