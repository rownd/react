import {
  getRowndAuthenticationStatus,
  RowndAuthenticatedUser,
} from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';

export type ReadOnlyRequestCookies = {
  get: (name: string) => RequestCookie | undefined;
};

export type RequestCookie = {
  name: string;
  value: string;
};

export const getRowndUser =
  async (cookies: () => ReadOnlyRequestCookies): Promise<RowndAuthenticatedUser | null> => {
    const rowndToken = cookies().get(ROWND_COOKIE_ID)?.value ?? null;
    const status = await getRowndAuthenticationStatus(rowndToken);

    if (!status.is_authenticated) {
      return null;
    }

    return {
      access_token: status.access_token,
      user_id: status.user_id,
    };
  };
