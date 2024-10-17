import * as jose from 'jose';
import { rowndCookie } from './cookie';

export type IsAuthenticatedResponse = {
  userId: string;
  accessToken: string;
  authenticated: true;
} | {
  userId: undefined;
  accessToken: undefined;
  authenticated: false;
};

const CLAIM_USER_ID = 'https://auth.rownd.io/app_user_id';

const validateAccessToken = async (
  cookieHeader: string
): Promise<{
    payload: jose.JWTPayload;
    accessToken: string
}> => {
  const cookie = rowndCookie.parse(cookieHeader);
  const accessToken = cookie?.accessToken;
  if (!accessToken) {
    throw new Error('Cookie does not have accessToken');
  }

  const authConfigRes = await fetch(
    'https://api.rownd.io/hub/auth/.well-known/oauth-authorization-server'
  );
  const authConfig = await authConfigRes.json();

  const jwksRes = await fetch(authConfig.jwks_uri);
  const jwks = await jwksRes.json();

  const keystore = jose.createLocalJWKSet(jwks);

  return {
    payload: (await jose.jwtVerify(accessToken, keystore)).payload,
    accessToken
  };
};

export const getRowndAuthenticationStatus = async (
  cookieHeader: string | null
): Promise<IsAuthenticatedResponse> => {
  try {
    if (!cookieHeader) {
      throw new Error('Cookie header is null');
    }
    const { payload, accessToken } = await validateAccessToken(cookieHeader);
    const userId = payload?.[CLAIM_USER_ID] as string | undefined;

    if (!userId) {
      throw new Error('Payload is missing user id claim');
    }
    return { userId, accessToken, authenticated: true };
  } catch (err) {
    console.log('validate access token error: ', err);
    return { authenticated: false, userId: undefined, accessToken: undefined };
  }
};
