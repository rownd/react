'use client';

import Link from 'next/link';
import { useRownd } from '@rownd/next';
import { useEffect } from 'react';

export default function Home() {
  const { onAuthenticated, requestSignIn, signOut, is_authenticated } =
    useRownd();

  useEffect(() => {
    const unsubscribe = onAuthenticated((userData) => {
      console.log('onAuthenticated', userData);
    });

    return () => unsubscribe();
  }, [onAuthenticated]);

  return (
    <div className="flex justify-center flex-col w-50 ">
      <h1 className="text-2xl font-bold">Home</h1>
      {is_authenticated ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => requestSignIn()}>Sign in</button>
      )}
      <Link
        className="text-underline text-sm text-gray-100 hover:text-gray-200"
        href="/authors"
      >
        Go to authors page
      </Link>
    </div>
  );
}
