import * as jose from 'jose';
import { rowndCookie } from './cookie';

export type IsAuthenticatedResponse =
  | {
      user_id: string;
      access_token: string;
      is_authenticated: true;
      is_expired: false;
    }
  | {
      user_id: undefined;
      access_token: undefined;
      is_authenticated: false;
      is_expired: boolean;
    };

const CLAIM_USER_ID = 'https://auth.rownd.io/app_user_id';

const KEYSTORE_CACHE_TTL = 1800; // 30 minutes
type Keystore = (
  protectedHeader?: jose.JWSHeaderParameters,
  token?: jose.FlattenedJWSInput
) => Promise<jose.KeyLike>;
let keystoreCache: undefined | { keystore: Keystore; expiresAt: number };

const getKeystore = async (): Promise<Keystore> => {
  let url: URL;
  const defaultUrl = 'https://api.rownd.io';
  try {
    url = new URL(process.env.ROWND_API_URL ?? defaultUrl);
  } catch {
    url = new URL(defaultUrl);
  }

  const authConfigRes = await fetch(
    `${url.origin}/hub/auth/.well-known/oauth-authorization-server`
  );
  const authConfig = await authConfigRes.json();

  const jwksRes = await fetch(authConfig.jwks_uri);
  const jwks = await jwksRes.json();

  return jose.createLocalJWKSet(jwks);
};

const validateAccessToken = async (
  cookieHeader: string
): Promise<{
  payload: jose.JWTPayload;
  accessToken: string;
}> => {
  const cookie = rowndCookie.parse(cookieHeader);
  const accessToken = cookie?.accessToken;
  if (!accessToken) {
    throw new Error('Cookie does not have accessToken');
  }

  let keystore: Keystore;
  if (!keystoreCache || keystoreCache.expiresAt < Date.now()) {
    keystore = await getKeystore();
    keystoreCache = {
      expiresAt: (Date.now() / 1000 + KEYSTORE_CACHE_TTL) * 1000,
      keystore,
    };
  } else {
    keystore = keystoreCache.keystore;
  }

  return {
    payload: (await jose.jwtVerify(accessToken, keystore)).payload,
    accessToken,
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
    return {
      user_id: userId,
      access_token: accessToken,
      is_authenticated: true,
      is_expired: false,
    };
  } catch (err) {
    console.log('validateAccessToken error:', err);
    let isExpired = false;

    if (err instanceof jose.errors.JWTExpired) {
      isExpired = true;
    }

    return {
      user_id: undefined,
      access_token: undefined,
      is_authenticated: false,
      is_expired: isExpired,
    };
  }
};
