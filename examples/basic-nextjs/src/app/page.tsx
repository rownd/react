'use client';

import { useRownd } from '@rownd/react';

export default function Home() {
  const { requestSignIn, is_authenticated } = useRownd();

  const isAuth = is_authenticated ? 'true' : 'false';

  return (
    <div className="flex justify-center flex-col w-50 ">
      <div className="text-center">Authenticated: {isAuth}</div>
      <button onClick={() => requestSignIn()}>login</button>
    </div>
  );
}
