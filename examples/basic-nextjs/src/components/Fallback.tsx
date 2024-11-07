'use client';

import { useRownd } from '../../../../src/next/client/useRownd';

export default function Fallback() {
  const { user, requestSignIn, is_authenticated, signOut, is_initializing, auth } = useRownd();

  return (
    <div>
      <h1>Fallback component</h1>
      {is_authenticated ? (
        <>
          <h1>Profile {user.data.user_id && user.data.user_id}</h1>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => requestSignIn()}>Sign In</button>
      )}
    </div>
  );
}
