import { create } from 'zustand';
import { AxiosInstance } from 'axios';

interface UserData {
  userId?: string | null;
  email?: string | null;
  accessToken?: string | null;
  password?: string | null;
}

interface AuthState {
  userData: UserData | null;
  error: any;
  axiosPrivate: AxiosInstance | null;
  refresh: () => Promise<string | null>;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  setAxiosPrivate: (axiosPrivate: AxiosInstance) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  userData: null,
  error: null,
  axiosPrivate: null,

  setAxiosPrivate: (axiosPrivate: AxiosInstance) => set({ axiosPrivate }),

  register: async (userData: UserData) => {
    try {
      const { axiosPrivate } = get();
      await axiosPrivate?.post('/auth/register', userData);
      set({ error: null });
    } catch (err: any) {
      const error = err.response || { status: err.status, data: err.message };
      set({ error });
    }
  },

  login: async (userData: UserData) => {
    try {
      const { axiosPrivate } = get();
      const response = await axiosPrivate?.post(
        'http://localhost:3001/auth/login',
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
      const { axiosPrivate } = get();
      const response = await axiosPrivate?.get('/auth/refresh');
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
      const { axiosPrivate } = get();
      await axiosPrivate?.get('/auth/logout');
      set({ userData: null, error: null });
    } catch (err: any) {
      const error = err.response || { status: err.status, data: err.message };
      set({ error });
    }
  },
}));

export default useAuthStore;
