import { UserContext } from '../../context/types';
import {
  getRowndAuthenticationStatus,
  getRowndUserData,
} from '../../ssr/server/token';

export const getRowndUser = async (request: Request): Promise<UserContext | null> => {
  const status = await getRowndAuthenticationStatus(
    request.headers.get('Cookie')
  );

  if (!status.access_token) {
    return null;
  }

  const userData = await getRowndUserData(status.access_token);
  return userData;
};
