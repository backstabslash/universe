import useAuthStore from '../store/auth';

const useRefreshToken = (): (() => Promise<string | null>) => {
  const refresh = useAuthStore(state => state.refresh);
  const refreshToken = async (): Promise<string | null> => {
    const accessToken = await refresh();
    return accessToken;
  };
  return refreshToken;
};

export default useRefreshToken;
