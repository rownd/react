import { NextResponse } from 'next/server';
import { withRowndMiddleware } from '@rownd/next/server';

export const middleware = withRowndMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match API routes
    '/api/rownd-token-callback',
  ],
};
