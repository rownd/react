import { describe, it, expect, vi } from 'vitest';
import { CLAIM_USER_ID, TokenHandler } from './token';
import { mockDeep } from 'vitest-mock-extended';
import createFetchMock from 'vitest-fetch-mock';
import * as jose from 'jose';
import crypto from 'node:crypto';

const fetchMock = createFetchMock(vi);
const mockJose = mockDeep<typeof jose>();

async function generateJwk(): Promise<jose.JWK> {
    const jwk = await new Promise<crypto.JsonWebKey>((resolve, reject) => {
        crypto.generateKeyPair('ed25519', undefined, (e, publicKey, privateKey) => {
          if (e) {
            reject(e);
          } else {
            resolve(
              privateKey.export({
                format: 'jwk',
              })
            );
          }
        });
      });

    return jwk as jose.JWK;
}

describe('TokenHandler', () => {

    describe('getKeystore', () => {
        it('should return the keystore', async () => {
            const tokenHandler = new TokenHandler(mockJose);

            const jwk = await generateJwk();

            const fm1 = fetchMock.mockOnceIf(req => req.url.includes('oauth-authorization-server'), () => Promise.resolve(new Response(JSON.stringify({
                jwks_uri: 'https://api.rownd.io/jwks',
            }))));
            const fm2 = fetchMock.mockOnceIf(req => req.url.includes('jwks'), () => new Response(JSON.stringify({
                keys: [jwk],
            })));

            mockJose.createLocalJWKSet.mockResolvedValueOnce(
                jose.createLocalJWKSet({
                    keys: [jwk],
                })
            );

            fetchMock.enableMocks();
            const keystore = await tokenHandler.getKeystore();
            fetchMock.dontMock();

            expect(fm1).toHaveBeenCalled();
            expect(fm2).toHaveBeenCalled();
            expect(mockJose.createLocalJWKSet).toHaveBeenCalledWith({
                keys: [jwk],
            });
            expect(keystore).toBeDefined();

            const keystore2 = await tokenHandler.getKeystore();
            expect(keystore2).toBe(keystore);
            expect(mockJose.createLocalJWKSet).toHaveBeenCalledOnce();
        });
    });

    describe('getRowndAuthenticationStatus', () => {
        it('should be unauthenticated when no cookie is present', async () => {
            const tokenHandler = new TokenHandler(mockJose);

            tokenHandler.determineAccessTokenFromCookie = vi.fn().mockReturnValueOnce(null);

            const status = await tokenHandler.getRowndAuthenticationStatus(null);

            expect(status.is_authenticated).toBe(false);
            expect(status.user_id).toBeUndefined();
            expect(status.access_token).toBeUndefined();
            expect(status.is_expired).toBe(false);
        })

        it('should be unauthenticated when the cookie is invalid', async () => {
            const tokenHandler = new TokenHandler(mockJose);

            tokenHandler.determineAccessTokenFromCookie = vi.fn().mockReturnValueOnce('invalid');

            const status = await tokenHandler.getRowndAuthenticationStatus(null);

            expect(status.is_authenticated).toBe(false);
            expect(status.user_id).toBeUndefined();
            expect(status.access_token).toBeUndefined();
            expect(status.is_expired).toBe(false);
        });

        it('should be authenticated when valid token is present in cookie', async () => {
            const tokenHandler = new TokenHandler(mockJose);

            tokenHandler.determineAccessTokenFromCookie = vi.fn().mockReturnValueOnce('valid_access_token');
            tokenHandler.validateAccessToken = vi.fn().mockResolvedValueOnce({
                payload: {
                    aud: ['app:123'],
                    [CLAIM_USER_ID]: 'user_123',
                },
                accessToken: 'valid_access_token',
            });

            const status = await tokenHandler.getRowndAuthenticationStatus(JSON.stringify({
                accessToken: 'valid_access_token',
            }));

            expect(status.is_authenticated).toBe(true);
            expect(status.user_id).toBe('user_123');
            expect(status.access_token).toBe('valid_access_token');
            expect(status.is_expired).toBe(false);
            expect(status.err).toBeUndefined();
        });

        it('should be authenticated when expired token is present in cookie and allow_expired is true', async () => {
            const tokenHandler = new TokenHandler(mockJose);

            tokenHandler.determineAccessTokenFromCookie = vi.fn().mockReturnValueOnce('valid_access_token');
            tokenHandler.validateAccessToken = vi.fn().mockRejectedValueOnce(
                new jose.errors.JWTExpired('Token expired', {
                    aud: ['app:123'],
                    [CLAIM_USER_ID]: 'user_123',
                }, 'expired')
            );

            mockJose.decodeJwt.mockReturnValueOnce({
                aud: ['app:123'],
                [CLAIM_USER_ID]: 'user_123',
            });

            tokenHandler.getKeystore = vi.fn().mockResolvedValueOnce(
                mockJose.createLocalJWKSet({
                    keys: [await generateJwk()],
                })
            );

            const status = await tokenHandler.getRowndAuthenticationStatus(JSON.stringify({
                accessToken: 'valid_access_token',
            }), { allowExpired: true });

            expect(status.is_authenticated).toBe(true);
            expect(status.user_id).toBe('user_123');
            expect(status.access_token).toBe('valid_access_token');
            expect(status.is_expired).toBe(true);
            expect(status.err).toBeUndefined();
        });

        it('should be unauthenticated when expired token is present in cookie and allowExpired is false', async () => {
            const tokenHandler = new TokenHandler(mockJose);

            tokenHandler.determineAccessTokenFromCookie = vi.fn().mockReturnValueOnce('valid_access_token');
            tokenHandler.validateAccessToken = vi.fn().mockRejectedValueOnce(
                new jose.errors.JWTExpired('Token expired', {
                    aud: ['app:123'],
                    [CLAIM_USER_ID]: 'user_123',
                }, 'expired')
            );

            mockJose.decodeJwt.mockReturnValueOnce({
                aud: ['app:123'],
                [CLAIM_USER_ID]: 'user_123',
            });

            tokenHandler.getKeystore = vi.fn().mockResolvedValueOnce(
                mockJose.createLocalJWKSet({
                    keys: [await generateJwk()],
                })
            );

            const status = await tokenHandler.getRowndAuthenticationStatus(JSON.stringify({
                accessToken: 'valid_access_token',
            }), { allowExpired: false });

            expect(status.is_authenticated).toBe(false);
            expect(status.user_id).toBeUndefined();
            expect(status.access_token).toBeUndefined();
            expect(status.is_expired).toBe(true);
            expect(status.err).toBeInstanceOf(jose.errors.JWTExpired);
        });
    });

    describe('determineAccessTokenFromCookie', () => {
        it('should return the access token from the cookie', () => {
            const tokenHandler = new TokenHandler(mockJose);

            const accessToken = tokenHandler.determineAccessTokenFromCookie(JSON.stringify({
                accessToken: 'valid_access_token',
            }));

            expect(accessToken).toBe('valid_access_token');
        });
    });

    describe('getRowndUserData', () => {
        it('should return the user data from the access token', async () => {
            const tokenHandler = new TokenHandler(mockJose);

            tokenHandler.validateAccessToken = vi.fn().mockResolvedValueOnce({
                payload: {
                    aud: ['app:123'],
                    [CLAIM_USER_ID]: 'user_123',
                },
                accessToken: 'valid_access_token',
            });

            fetchMock.mockOnce(() => Promise.resolve(new Response(JSON.stringify({
                user_id: 'user_123',
            }))));

            fetchMock.enableMocks();
            const userData = await tokenHandler.getRowndUserData('valid_access_token');
            fetchMock.dontMock();

            expect(userData).toEqual({
                user_id: 'user_123',
            });
        });
    });
});