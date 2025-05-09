import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
// import { RowndProvider } from '@rownd/next';
import { RowndProvider } from '@rownd/next';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <NextJSRowndProvider
          appKey="key_ov0nu0ckrmhxctupfgnlrwxt"
          apiUrl="https://api.us-east-2.dev.rownd.io/"
          hubUrlOverride="https://hub.dev.rownd.io/"
        >
          {children}
        </NextJSRowndProvider> */}
        <RowndProvider
          appKey="key_nmdccn7goxjch5s0hoholrh9"
        >
          {children}
        </RowndProvider>
      </body>
    </html>
  );
}
