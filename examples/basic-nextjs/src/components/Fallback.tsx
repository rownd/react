'use client';

import { useRownd } from '../../../../src/next/client/useRownd';

export default function Fallback() {
  const { user, requestSignIn, is_authenticated, signOut, is_initializing, auth } = useRownd();

  return (
    <div>
      <h1 className="text-2xl font-bold">Fallback component</h1>
      {is_authenticated ? (
        <>
          <button className="bg-gray-800 text-gray-100 p-2 rounded-md" onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button className="bg-gray-800 text-gray-100 p-2 rounded-md" onClick={() => requestSignIn()}>Sign In</button>
      )}
    </div>
  );
}
