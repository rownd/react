import * as jose from 'jose';
import { rowndCookie, RowndCookieData } from './cookie';
import { UserContext } from '../../context/types';

export type RowndAuthenticatedUser = {
  user_id: string;
  access_token: string;
}

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

export const getRowndApiUrl = (): URL => {
  let url: URL;
  const defaultUrl = 'https://api.rownd.io';
  try {
    url = new URL(process.env.ROWND_API_URL ?? defaultUrl);
  } catch {
    url = new URL(defaultUrl);
  }
  return url;
}

const KEYSTORE_CACHE_TTL = 1800; // 30 minutes
type Keystore = (
  protectedHeader?: jose.JWSHeaderParameters,
  token?: jose.FlattenedJWSInput
) => Promise<jose.KeyLike>;
let keystoreCache: undefined | { keystore: Keystore; expiresAt: number };

const getKeystore = async (): Promise<Keystore> => {
  const authConfigRes = await fetch(
    `${getRowndApiUrl().origin}/hub/auth/.well-known/oauth-authorization-server`
  );
  const authConfig = await authConfigRes.json();

  const jwksRes = await fetch(authConfig.jwks_uri);
  const jwks = await jwksRes.json();

  return jose.createLocalJWKSet(jwks);
};

const validateAccessToken = async (
  accessToken?: string
): Promise<{
  payload: jose.JWTPayload;
  accessToken: string;
}> => {

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

const determineAccessTokenFromCookie = (cookie: string): string | undefined => {

  let cookieData: RowndCookieData | undefined

  // First, try to parse as JSON
  try {
    const parsedCookie = JSON.parse(cookie);
    if (parsedCookie.accessToken) {
      cookieData = parsedCookie
    }
  } catch {
    // Do nothing
  }

  // If that fails, try to parse as a cookie string
  if (!cookieData) {
    cookieData = rowndCookie.parse(cookie);
  }

  return cookieData?.accessToken
}

export const getRowndAuthenticationStatus = async (
  cookie: string | null
): Promise<IsAuthenticatedResponse> => {
  try {
    if (!cookie) {
      throw new Error('Cookie is null');
    }

    const unverifiedAccessToken = determineAccessTokenFromCookie(cookie);

    if (!unverifiedAccessToken) {
      throw new Error('Cookie is missing access token');
    }

    const { payload, accessToken } = await validateAccessToken(unverifiedAccessToken);
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
    if (err instanceof Error) {
      console.log('validateAccessToken failed:', err.message);
    } else {
      console.log('validateAccessToken failed:', err);
    }
    let isExpired = false;

    if (err instanceof jose.errors.JWTExpired) {
      isExpired = true;
    }

    return {
      is_authenticated: false,
      user_id: undefined,
      access_token: undefined,
      is_expired: isExpired,
    };
  }
};

export const getRowndUserData = async (accessToken: string): Promise<null | UserContext> => {
  const { payload } = await validateAccessToken(accessToken);

  const aud = payload?.["aud"];

  if (!aud || typeof aud === 'string') {
    return null;
  }

  const appId = aud[0]?.split(':')?.[1];

  if (!appId) {
    return null;
  }

  let userData: UserContext;

  try {
    const userDataRes = await fetch(`${getRowndApiUrl().origin}/me/applications/${appId}/data`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    userData = await userDataRes.json();
  } catch (err) {
    console.error('Error fetching user data:', err);
    return null;
  }

  return userData;
}
