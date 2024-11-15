import { getRowndAuthenticationStatus } from '../../ssr/server/token';

export const isAuthenticated = async (request: Request): Promise<Boolean> => {
  const status = await getRowndAuthenticationStatus(
    request.headers.get('Cookie')
  );

  return status.is_authenticated;
};
