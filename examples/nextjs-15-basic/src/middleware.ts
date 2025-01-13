import { NextResponse } from 'next/server';
import { withRowndMiddleware } from '@rownd/next/server';

export const middleware = withRowndMiddleware((req) => {
  if (req.user) {
    console.log('User is authenticated');
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match API routes
    '/api/rownd-token-callback',
    '/:path*',
  ],
};
