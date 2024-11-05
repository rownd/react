import { useCallback } from 'react';
import { useRownd } from '../useRownd';
import { setCookie } from '../server/cookie';

const useCookie = () => {
  const { getAccessToken } = useRownd();

  const cookieSignIn = useCallback(
    async (callback?: () => void) => {
      const token = await getAccessToken();
      if (!token) {
        return;
      }
      await setCookie(token);
      callback?.();
    },
    [getAccessToken]
  );

  const cookieSignOut = useCallback(async (callback?: () => void) => {
    try {
      await setCookie('invalid');
      callback?.();
    } catch (err) {
      console.log('Failed to sign out cookie: ', err);
    }
  }, []);

  return { cookieSignIn, cookieSignOut };
};

export default useCookie;
