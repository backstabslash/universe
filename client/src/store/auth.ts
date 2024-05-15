import { create } from 'zustand';
import axios from 'axios';

interface UserData {
  userId?: string | null;
  email?: string | null;
  accessToken?: string | null;
  password?: string | null;
}

interface AuthState {
  userData: UserData | null;
  error: any;
  refresh: () => Promise<string | null>;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
}

const BASE_URL = 'http://localhost:3001';

const useAuthStore = create<AuthState>(set => ({
  userData: null,
  error: null,

  register: async (userData: UserData) => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, userData);
      set({ error: null });
    } catch (err: any) {
      const error = err.response || { status: err.status, data: err.message };
      set({ error });
    }
  },

  login: async (userData: UserData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email: userData.email,
          password: userData.password,
        },
        { withCredentials: true }
      );
      set({ userData: response?.data?.accessToken, error: null });
    } catch (err: any) {
      const error = err.response || { status: err.status, data: err.message };
      set({ userData: null, error });
    }
  },

  refresh: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/refresh`, {
        withCredentials: true,
      });
      set({ userData: response?.data, error: null });
      return response?.data?.accessToken;
    } catch (err: any) {
      const error = err.response || { status: err.status, data: err.message };
      set({ error });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      set({ userData: null, error: null });
    } catch (err: any) {
      const error = err.response || { status: err.status, data: err.message };
      set({ error });
    }
  },
}));

export default useAuthStore;
