# Next.js

## Installation

Simply run `npm install @rownd/next` or `yarn add @rownd/next`.

### Setup

In the root `layout.tsx` of your app:

```jsx
import { RowndProvider } from '@rownd/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body>
        <RowndProvider
          appKey="<your app key>"
          apiUrl="<your api url>"
          hubUrlOverride="<your hub url>"
        >
          {children}
        </RowndProvider>
      </body>
    </html>
  );
}
```

In your main `middleware.ts` file, add the Rownd middleware higher-order function. As well as the Rownd token callback path:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withRowndMiddleware } from '@rownd/next';

export const middleware = withRowndMiddleware((request: NextRequest) => {
  return NextResponse.next();
});

...


export const config = {
  matcher: [
    // Ensure the Rownd token callback path is matched
    '/api/rownd-token-callback',
  ],
};

```


### Protected page
To protect a page from being accessed by unauthenticated users, you can use
the `withRowndRequireSignIn` higher-order component.

```jsx
import {
  withRowndRequireSignIn,
  getRowndUser,
} from '@rownd/next';

async function ProtectedPage() {
  const { user_id, access_token } = await getRowndUser();
  return (
    <div>
      ...
      <h1>User ID: {user_id}</h1>
    </div>
  );
}

function Fallback() {
  return <div>Loading...</div>;
}

export default withRowndRequireSignIn(ProtectedPage, Fallback, {
  onUnauthenticated: () => {
    // Handle unauthenticated flow
  },
});
```

### API reference

Please see the [React SDK](/rownd/react/blob/main?tab=readme-ov-file#api-reference) for details on
Rownd Client React API's.