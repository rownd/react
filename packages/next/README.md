# Rownd Next.js SDK Documentation


## Installation

Run `npm install @rownd/next` or `yarn add @rownd/next`.

## Core Components
###RowndProvider

The root component that initializes Rownd authentication and state management. Add this to your root layout:


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

| Prop | Description | Required | Default |
|------|-------------|----------|---------|
| appKey | Your unique Rownd application identifier | Yes | - |
| apiUrl | Enterprise API endpoint for Rownd services | No | https://api.rownd.io |
| hubUrlOverride | Enterprise URL for the Rownd authentication hub interface | No | https://hub.rownd.io |

> 💡 **Note**  
> Enterprise endpoints are not needed in most use-cases and these props will default to Rownd's commercial cloud


###Middleware Setup
In your main `middleware.ts` file, add the Rownd middleware higher-order function. As well as the Rownd token callback path:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withRowndMiddleware, ROWND_TOKEN_CALLBACK_PATH } from '@rownd/next';

export const middleware = withRowndMiddleware((request: NextRequest) => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Required for Rownd token handling
    ROWND_TOKEN_CALLBACK_PATH,
    // Add your protected routes
    '/protected/:path*'
  ]
};

```

##Authentication Components

### Protected Routes / Pages
To protect a page from being accessed by unauthenticated users, you can use
the `withRowndRequireSignIn` higher-order component.

```jsx
import {
  withRowndRequireSignIn,
  getRowndUser,
} from '@rownd/next';

async function ProtectedPage() {
  const user = await getRowndUser();
  
  return (
    <div>
      <h1>Welcome {user.user_id}</h1>
      <p>Your access token: {user.access_token}</p>
    </div>
  );
}

// Fallback component shown during authentication
function AuthFallback() {
  return <div>Please sign in to continue...</div>;
}

export default withRowndRequireSignIn(ProtectedPage, AuthFallback, {
  onUnauthenticated: () => {
    // Optional callback when user is not authenticated
  }
});
```

### Client-Side Authentication
Use the `useRownd` hook to access authentication state and methods:

```typescript
'use client';

import { useRownd } from '@rownd/next';

export function AuthenticationStatus() {
  const { 
    is_authenticated,
    is_initializing,
    access_token,
    requestSignIn,
    signOut
  } = useRownd();

  if (is_initializing) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {is_authenticated ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={requestSignIn}>Sign In</button>
      )}
    </div>
  );
}
```

##Server Utilities
### getRowndUser
Server-side function to get the current authenticated user:

```typescript
import { getRowndUser } from '@rownd/next';

async function ServerComponent() {
  const user = await getRowndUser();
  
  if (!user) {
    return <div>Not authenticated</div>;
  }
  
  return (
    <div>
      <h1>User ID: {user.user_id}</h1>
      <p>Token: {user.access_token}</p>
    </div>
  );
}
```

##State Management
The SDK uses a custom store implementation for managing authentication state. The store includes:

```typescript
interface RowndState {
  is_initializing: boolean;
  is_authenticated: boolean;
  access_token: string | null;
  user: {
    data: Record<string, any>;
    groups: string[];
    redacted_fields: string[];
    verified_data: Record<string, any>;
    meta: Record<string, any>;
    is_loading: boolean;
  };
}
```

## Available Methods

The `useRownd` hook provides the following methods:

| Method | Description | Return Type |
|--------|-------------|-------------|
| `requestSignIn()` | Triggers the sign-in modal | `void` |
| `signOut()` | Signs out the current user | `void` |
| `setUser()` | Updates user data | `Promise<UserContext>` |
| `getAccessToken()` | Gets the current access token | `Promise<string>` |
| `manageAccount()` | Opens the account management interface | `void` |
| `getFirebaseIdToken()` | Gets the Firebase ID token | `Promise<string>` |
| `setUserValue()` | Updates specific user field | `Promise<UserContext>` |


### API reference

Please see the [React SDK](/rownd/react/blob/main?tab=readme-ov-file#api-reference) for details on
Rownd Client React API's.
