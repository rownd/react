import { getRowndAuthenticationStatus } from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';
import { ReadOnlyRequestCookies } from './getRowndUser';

export const isAuthenticated = async (
  cookies: () => ReadOnlyRequestCookies
): Promise<boolean> => {
  const rowndToken = cookies().get(ROWND_COOKIE_ID)?.value ?? null;
  const status = await getRowndAuthenticationStatus(rowndToken);

  return status.is_authenticated;
};
