import React, { useEffect, useRef, useState } from 'react';
import { useRownd } from './useRownd';
import useCookie from '../../ssr/hooks/useCookie';
import { getOnAuthenticatedListeners } from '../../utils/listeners';

const RemixClientScript: React.FC = () => {
  const { access_token, is_initializing, user, is_authenticated } = useRownd();
  const { cookieSignIn, cookieSignOut } = useCookie(useRownd);
  const [hasCookieSignedIn, setHasCookieSignedIn] = useState(false);

  // Listen for access_token changes to determine when to sign(In/Out) cookies and state.
  const prevAccessToken = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (is_initializing || prevAccessToken.current === access_token) return;

    prevAccessToken.current = access_token;

    if (!access_token) {
      setHasCookieSignedIn(false);
      cookieSignOut();
      return;
    }

    cookieSignIn().then(() => setHasCookieSignedIn(true));
  }, [is_initializing, access_token, cookieSignOut, cookieSignIn]);

  useEffect(() => {
    if (hasCookieSignedIn && Boolean(user.data.user_id) && !is_initializing && is_authenticated) {
      getOnAuthenticatedListeners().forEach(({ callback }) => callback(user.data));
    }
  }, [hasCookieSignedIn, user.data.user_id, is_initializing, is_authenticated]);

  return null;
};

export default RemixClientScript;
