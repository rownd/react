import { getRowndAuthenticationStatus } from '../../ssr/server/token';
import { ROWND_COOKIE_ID } from '../../ssr/server/cookie';
import { RequestCookiesFn } from './getRowndUser';

export const isAuthenticated = async (
  cookies: RequestCookiesFn
): Promise<boolean> => {
  const cookieObj = await cookies();
  const rowndToken = cookieObj.get(ROWND_COOKIE_ID)?.value ?? null;
  const status = await getRowndAuthenticationStatus(rowndToken);

  return status.is_authenticated;
};
