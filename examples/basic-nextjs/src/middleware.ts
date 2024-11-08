import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withRowndMiddleware } from '../../../src/next/server/withRowndMiddleware';

export const middleware = withRowndMiddleware((request: NextRequest) => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match API routes
    '/api/rownd-token-callback',
  ],
};
