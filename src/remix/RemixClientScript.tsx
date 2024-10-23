import React, { useEffect, useRef } from 'react';
import { useRownd } from './useRownd';
import useCookie from './hooks/useCookie';

const RemixClientScript: React.FC = () => {
  const { access_token, is_initializing } = useRownd();
  const { cookieSignIn, cookieSignOut } = useCookie();

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
