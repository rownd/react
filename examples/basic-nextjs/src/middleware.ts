import { NextResponse } from 'next/server';
import { withRowndMiddleware, ROWND_TOKEN_CALLBACK_PATH } from '@rownd/next/server';

export const middleware = withRowndMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match API routes
    ROWND_TOKEN_CALLBACK_PATH,
  ],
};
