import {
  getRowndAuthenticationStatus,
  getRowndUserData,
} from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';
import { UserContext } from '../../context/types';

export type ReadOnlyRequestCookies = {
  get: (name: string) => RequestCookie | undefined;
};

export type RequestCookie = {
  name: string;
  value: string;
};

export const getRowndUser =
  async (cookies: () => ReadOnlyRequestCookies): Promise<UserContext | null> => {
    const rowndToken = cookies().get(ROWND_COOKIE_ID)?.value ?? null;
    const status = await getRowndAuthenticationStatus(rowndToken);

    if (!status.access_token) {
      return null;
    }

    const userData = await getRowndUserData(status.access_token);
    return userData;
  };
