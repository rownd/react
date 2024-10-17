import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRownd } from './useRownd';
import { RequireSignIn } from '../index';
import { setCookie } from './server/cookie';

const withRowndRequireSignIn = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  useLoaderData: () => any,
  Fallback?: React.ComponentType
): React.FC<P> => {
  return (props: P) => {
    const { access_token, getAccessToken, is_initializing } = useRownd();
    const data = useLoaderData();

    const isPropsFallbackEnabled = useMemo(
      () => data?.authenticated === false,
      [data?.authenticated]
    );

    const cookieSignIn = useCallback(
      async () => {
        const token = await getAccessToken();
        if (!token) {
          return;
        }
        await setCookie(token);
        window.location.reload();
      },
      [getAccessToken]
    );

    // Trigger cookieSignIn when new accessToken is available.
    const prevAccessToken = useRef<string | null | undefined>(undefined);
    useEffect(() => {
      if (is_initializing || prevAccessToken.current === access_token) {
        return;
      }

      prevAccessToken.current = access_token;
      if (access_token && isPropsFallbackEnabled) {
        cookieSignIn();
        return;
      }
    }, [cookieSignIn, is_initializing, access_token, isPropsFallbackEnabled]);

    return (
      <RequireSignIn>
        {isPropsFallbackEnabled ? (
          Fallback ? (
            <Fallback />
          ) : (
            <>Provide a fallback</>
          )
        ) : (
          <WrappedComponent {...(props as P)} />
        )}
      </RequireSignIn>
    );
  };
};

export default withRowndRequireSignIn;
