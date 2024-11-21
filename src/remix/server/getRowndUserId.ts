import { getRowndAuthenticationStatus } from '../../ssr/server/token';

export const getRowndUserId = async (request: Request): Promise<string | null> => {
  const status = await getRowndAuthenticationStatus(
    request.headers.get('Cookie')
  );

  return status.user_id ?? null;
};
