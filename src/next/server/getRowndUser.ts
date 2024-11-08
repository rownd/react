import { cookies } from 'next/headers';
import {
  getRowndAuthenticationStatus,
  RowndAuthenticatedUser,
} from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';

export const getRowndUser =
  async (): Promise<RowndAuthenticatedUser | null> => {
    const cookieStore = cookies();
    const rowndToken = cookieStore.get(ROWND_COOKIE_ID)?.value ?? null;
    const status = await getRowndAuthenticationStatus(rowndToken);

    if (!status.is_authenticated) {
      return null;
    }

    return {
      access_token: status.access_token,
      user_id: status.user_id,
    };
  };
