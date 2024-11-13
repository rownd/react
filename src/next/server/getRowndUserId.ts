import { getRowndAuthenticationStatus } from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';
import { ReadOnlyRequestCookies } from './getRowndUser';

export const getRowndUserId = async (
  cookies: () => ReadOnlyRequestCookies
): Promise<string | null> => {
  const rowndToken = cookies().get(ROWND_COOKIE_ID)?.value ?? null;
  const status = await getRowndAuthenticationStatus(rowndToken);

  return status.user_id ?? null;
};
