import type { Metadata } from 'next';
import { RowndProvider } from '@rownd/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js SuperTokens Migration Example',
  description: 'Test Rownd-to-SuperTokens lazy migration with @rownd/next',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RowndProvider
          appKey={process.env.NEXT_PUBLIC_ROWND_APP_KEY!}
          supertokens={{
            appInfo: {
              appName: 'Next.js User Migration Example',
              apiDomain: 'http://localhost:3001',
              apiBasePath: '/auth',
            },
          }}
        >
          {children}
        </RowndProvider>
      </body>
    </html>
  );
}
