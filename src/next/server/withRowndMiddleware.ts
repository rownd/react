import { handleRowndTokenCallback } from '../../remix/server/withRowndActionHandler';
import { ROWND_COOKIE_ID, ROWND_TOKEN_CALLBACK_PATH } from '../../ssr/server/cookie';
import { getRowndAuthenticationStatus } from '../../ssr/server/token';

type NextResponse = any;
type NextRequest = any;

export const withRowndMiddleware = (
  middleware: (request: NextRequest) => NextResponse
) => {
  return (request: NextRequest) => {
    if (request?.nextUrl?.pathname?.startsWith(ROWND_TOKEN_CALLBACK_PATH)) {
      return handleRowndTokenCallback(request)
    }

    return getRowndAuthenticationStatus(request.cookies.get(ROWND_COOKIE_ID)?.value || null).then((tokenInfo) => {
      request.auth = tokenInfo;

      return middleware(request);
    });
  };
};
