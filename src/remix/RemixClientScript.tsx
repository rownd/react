import React, { useCallback, useEffect, useRef } from 'react';
import { useRownd } from './useRownd';
import { setCookie } from './server/cookie';

const RemixClientScript: React.FC = () => {
  const { access_token, is_initializing, getAccessToken } = useRownd();

  const cookieSignIn = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;
    await setCookie(token);
  }, [getAccessToken]);

  const cookieSignOut = useCallback(async () => {
    try {
      await setCookie('invalid');
    } catch (err) {
      console.log('Failed to sign out cookie: ', err);
    }
  }, []);

  // Listen for access_token changes to determine when to sign(In/Out) cookies and state.
  const prevAccessToken = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (is_initializing || prevAccessToken.current === access_token) return;

    prevAccessToken.current = access_token;

    if (!access_token) {
      cookieSignOut();
      return;
    }

    cookieSignIn();
  }, [is_initializing, access_token, cookieSignOut, cookieSignIn]);

  return null;
};

export default RemixClientScript;
