import React from 'react';
import { cookies } from 'next/headers';
import { getRowndAuthenticationStatus, RowndAuthenticatedUser } from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';
import RequireSignIn from '../client/components/RequireSignIn';

type ReactServerComponent<Props = {}> = (props: Props) => React.ReactNode;

const withRowndRequireSignIn = <P extends object>(
  WrappedComponent: ReactServerComponent<P>,
  Fallback: React.ComponentType,
  options: {
    onUnauthenticated?: () => void;
  } = {}
) => {
  return async (props: P) => {
    const cookieStore = cookies();
    const rowndToken = cookieStore.get(ROWND_COOKIE_ID)?.value ?? null;
    const status = await getRowndAuthenticationStatus(rowndToken);

    if (!status.is_authenticated) {
      if (options.onUnauthenticated && !status.is_expired) {
        options.onUnauthenticated();
      }
      return (
        <>
          <RequireSignIn isFallback={true} />
          {/* @ts-ignore */}
          <Fallback />
        </>
      );
    }

    const user: RowndAuthenticatedUser = {
        access_token: status.access_token,
        user_id: status.user_id,
    };


    // @ts-ignore
    const Component = WrappedComponent as unknown as React.ComponentType<P>;
    return (
      <>
        {/* @ts-ignore */}
        <Component {...props} user={user}  />
        {/* @ts-ignore */}
        <RequireSignIn isFallback={false} />
      </>
    );
  };
};

export default withRowndRequireSignIn;
