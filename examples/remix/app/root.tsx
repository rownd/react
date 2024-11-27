import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import './tailwind.css';
import { RemixRowndProvider } from '../../../src/remix/index';

export const loader = async (): Promise<{
  env: {
    ROWND_APP_KEY: string | undefined;
    ROWND_API_URL: string | undefined;
    ROWND_HUB_URL: string | undefined;
  };
}> => {
  return {
    env: {
      ROWND_APP_KEY: process.env.ROWND_APP_KEY,
      ROWND_API_URL: process.env.ROWND_API_URL,
      ROWND_HUB_URL: process.env.ROWND_HUB_URL,
    },
  };
};

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { env } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RemixRowndProvider
          postSignOutRedirect="/"
          appKey={env.ROWND_APP_KEY ?? ''}
          apiUrl={env.ROWND_API_URL}
          hubUrlOverride={env.ROWND_HUB_URL}
        >
          {children}
        </RemixRowndProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
