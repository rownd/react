import React from 'react';
import { getRowndAuthenticationStatus, RowndAuthenticatedUser } from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';
import RequireSignIn from './components/RequireSignIn';
import { ReadOnlyRequestCookies } from '../server/getRowndUser';

type ReactServerComponent<Props> = (props: Props) => React.ReactNode;

const withRowndRequireSignIn = <P extends object>(
  WrappedComponent: ReactServerComponent<P>,
  cookies: () => ReadOnlyRequestCookies,
  Fallback: React.ComponentType,
  options: {
    onUnauthenticated?: () => void;
  } | undefined
) => {
  return async (props: P) => {
    const rowndToken = cookies().get(ROWND_COOKIE_ID)?.value ?? null;
    const status = await getRowndAuthenticationStatus(rowndToken);

    if (!status.is_authenticated) {
      if (options?.onUnauthenticated && !status.is_expired) {
        options.onUnauthenticated();
      }
      return (
        <>
          <RequireSignIn isFallback={true} />
          <Fallback />
        </>
      );
    }

    const user: RowndAuthenticatedUser = {
        access_token: status.access_token,
        user_id: status.user_id,
    };

    const Component = WrappedComponent as unknown as React.ComponentType<P>;
    return (
      <>
        <Component {...props} user={user} />
        <RequireSignIn isFallback={false} />
      </>
    );
  };
};

export default withRowndRequireSignIn;
