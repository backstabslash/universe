import { useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import useRefreshToken from './useRefreshToken';
import useAuthStore from '../store/auth';

const BASE_URL = 'http://localhost:3001';

const axiosPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const useAxiosPrivate = (): AxiosInstance => {
  const { userData } = useAuthStore(state => ({
    userData: state.userData,
  }));

  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['authorization']) {
          config.headers['authorization'] = `Bearer ${userData?.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [userData?.accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
