import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuthStore from '../store/auth';

const PersistLogin = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refresh = useRefreshToken();
  const { userData } = useAuthStore(state => ({
    userData: state.userData,
  }));

  const navigate = useNavigate();

  const verifyRefreshToken = async (): Promise<void> => {
    try {
      await refresh();
    } catch (err) {
      navigate('/main');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!userData?.accessToken) {
        await verifyRefreshToken();
      } else {
        setIsLoading(false);
      }
    })();
  }, []);

  return isLoading ? <></> : <Outlet />;
};

export default PersistLogin;
