'use client';

import { useEffect, useRef } from 'react';
import useCookie from '../../../ssr/hooks/useCookie';
import { useRownd } from '../useRownd';

const RowndServerStateSync = () => {
  const { access_token, is_initializing } = useRownd();
  const { cookieSignIn, cookieSignOut } = useCookie(useRownd);

  // Trigger cookieSignIn when new accessToken is available.
  const prevAccessToken = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (is_initializing) {
      prevAccessToken.current = access_token;
      return;
    }

    if (prevAccessToken.current === access_token) {
      return;
    }

    prevAccessToken.current = access_token;

    if (access_token) {
      cookieSignIn(() => window.location.reload());
      return;
    }

    // Handle sign out
    if (!access_token) {
      cookieSignOut(() => window.location.reload());
    }
  }, [
    cookieSignIn,
    is_initializing,
    access_token,
    cookieSignOut,
  ]);

  return null;
};

export default RowndServerStateSync;
