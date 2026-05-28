'use client';

import { useRownd } from '@rownd/next';

export default function Home() {
  const { access_token, is_authenticated, requestSignIn, signOut, user } =
    useRownd();

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">@rownd/next</p>
        <h1>Next.js SuperTokens Migration Example</h1>
        <p className="lede">
          Sign up as a new Rownd user. The Next client should call the
          SuperTokens migration endpoint after Rownd emits
          <code>sign_in_completed</code> for a new user.
        </p>

        <div className="panel">
          {is_authenticated ? (
            <div className="stack">
              <p>
                Signed in as:{' '}
                <strong>{(user.data?.email as string) || 'unknown user'}</strong>
              </p>
              <div>
                <p className="label">Access token</p>
                <code className="token">{access_token}</code>
              </div>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          ) : (
            <div className="stack">
              <p>Not signed in.</p>
              <button onClick={() => requestSignIn()}>Sign in</button>
            </div>
          )}
        </div>

        <p className="hint">
          Backend logs should show <code>POST /auth/plugin/rownd/migrate</code>
          for new users only.
        </p>
      </section>
    </main>
  );
}
