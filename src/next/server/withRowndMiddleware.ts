import { handleRowndTokenCallback } from '../../remix/server/withRowndActionHandler';
import { ROWND_TOKEN_CALLBACK_PATH } from '../../ssr/server/cookie';

type NextResponse = any;
type NextRequest = any;

export const withRowndMiddleware = (
  middleware: (request: any) => NextResponse
) => {
  return (request: NextRequest) => {
    if (request?.nextUrl?.pathname?.startsWith(ROWND_TOKEN_CALLBACK_PATH)) {
      return handleRowndTokenCallback(request)
    }
    return middleware(request);
  };
};
