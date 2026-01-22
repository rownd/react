'use client';

import { useEffect, useRef } from 'react';
import useCookie from '../../../ssr/hooks/useCookie';
import { useRownd } from '../useRownd';

const RowndServerStateSync = () => {
  const { access_token, is_initializing } = useRownd();
  const { cookieSignIn, cookieSignOut } = useCookie(useRownd);

  // Trigger cookieSignIn when new accessToken is available.
  const prevAccessToken = useRef<string | null | undefined>(undefined);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (is_initializing) {
      return;
    }

    // Track initialization state
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      prevAccessToken.current = access_token;

      // If we have a token on initial load, sync it without reload
      if (access_token) {
        cookieSignIn();
      }
      return;
    }

    if (prevAccessToken.current === access_token) {
      return;
    }

    const wasSignedOut = !prevAccessToken.current;
    const isSigningIn = wasSignedOut && !!access_token;
    const isSigningOut = !!prevAccessToken.current && !access_token;
    const isTokenRefresh = !!prevAccessToken.current && !!access_token;

    prevAccessToken.current = access_token;

    if (isSigningIn) {
      // User just signed in - sync cookie and reload
      // This ensures server has the cookie for initial authenticated render
      cookieSignIn(() => window.location.reload());
      return;
    }

    if (isTokenRefresh) {
      // Token was refreshed in background - sync cookie silently, no reload
      cookieSignIn();
      return;
    }

    if (isSigningOut) {
      // User signed out - sync cookie and reload
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
