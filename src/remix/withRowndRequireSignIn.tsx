import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    const [signingOut, setSigningOut] = useState(false);

    const isPropsFallbackEnabled = useMemo(
      () => data?.is_authenticated === false,
      [data?.is_authenticated]
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

    const cookieSignOut = useCallback(async () => {
      try {
        await setCookie('invalid');
        window.location.reload();
      } catch (err) {
        console.log('Failed to sign out cookie: ', err);
        setSigningOut(false);
      }
    }, []);

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

      // Handle sign out
      if (!access_token && !isPropsFallbackEnabled) {
        setSigningOut(true);
        cookieSignOut();
      }
    }, [cookieSignIn, is_initializing, access_token, isPropsFallbackEnabled, cookieSignOut]);

    const FallbackElement = useMemo(() => Fallback ? (
      <Fallback />
    ) : (
      <>Provide a fallback</>
    ), [Fallback]);

    // This prevents the Hub sign in modal from being shown when the user is signing out.
    const isRequireSignInDisabled = useMemo(() => {
      return !isPropsFallbackEnabled && (Boolean(prevAccessToken.current) || signingOut);
    }, [isPropsFallbackEnabled, prevAccessToken.current, signingOut]);

    // If the user is signing out, show the fallback component.
    if (signingOut) {
      return FallbackElement;
    }

    return (
      <RequireSignIn disabled={isRequireSignInDisabled}>
        {isPropsFallbackEnabled ? (
          FallbackElement
        ) : (
          <WrappedComponent {...(props as P)} />
        )}
      </RequireSignIn>
    );
  };
};

export default withRowndRequireSignIn;
