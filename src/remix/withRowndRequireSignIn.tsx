import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRownd } from './useRownd';
import { RequireSignIn } from '../index';
import useCookie from '../ssr/hooks/useCookie';

const withRowndRequireSignIn = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  useLoaderData: () => any,
  Fallback?: React.ComponentType
): React.FC<P> => {
  return (props: P) => {
    const { access_token, is_initializing } = useRownd();
    const data = useLoaderData();
    const [signingOut, setSigningOut] = useState(false);
    const { cookieSignIn, cookieSignOut } = useCookie(useRownd);

    const isPropsFallbackEnabled = useMemo(
      () => data?.is_authenticated === false || data?.is_expired === true,
      [data?.is_authenticated]
    );

    // Trigger cookieSignIn when new accessToken is available.
    const prevAccessToken = useRef<string | null | undefined>(undefined);
    useEffect(() => {
      if (is_initializing || prevAccessToken.current === access_token) {
        return;
      }

      prevAccessToken.current = access_token;

      if (access_token && isPropsFallbackEnabled) {
        cookieSignIn(() => window.location.reload());
        return;
      }

      // Handle sign out
      if (!access_token && !isPropsFallbackEnabled) {
        setSigningOut(true);
        cookieSignOut(() => window.location.reload());
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
