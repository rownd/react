'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useCookie from '../../../ssr/hooks/useCookie';
import { useRownd } from '../useRownd';

type RequireSignInProps = {
  isFallback: boolean;
};

const RequireSignIn = ({ isFallback }: RequireSignInProps) => {
  const { access_token, is_initializing, requestSignIn, is_authenticated } = useRownd();
  const { cookieSignIn, cookieSignOut } = useCookie(useRownd);
  const [signingOut, setSigningOut] = useState(false);

  // Trigger cookieSignIn when new accessToken is available.
  const prevAccessToken = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (is_initializing || prevAccessToken.current === access_token) {
      return;
    }

    prevAccessToken.current = access_token;

    if (access_token && isFallback) {
      cookieSignIn(() => window.location.reload());
      return;
    }

    // Handle sign out
    if (!access_token && !isFallback) {
      setSigningOut(true);
      cookieSignOut(() => window.location.reload());
    }
  }, [
    cookieSignIn,
    is_initializing,
    access_token,
    isFallback,
    cookieSignOut,
  ]);

  // This prevents the Hub sign in modal from being shown when the user is signing out.
  const isRequireSignInDisabled = useMemo(() => {
    return !isFallback && (Boolean(prevAccessToken.current) || signingOut);
  }, [isFallback, prevAccessToken.current, signingOut]);

  useEffect(() => {
    if (!is_authenticated && !is_initializing && !isRequireSignInDisabled) {
      requestSignIn({ prevent_closing: true });
    }
  }, [is_authenticated, is_initializing, requestSignIn, isRequireSignInDisabled]);

  return null;
};

export default RequireSignIn;
