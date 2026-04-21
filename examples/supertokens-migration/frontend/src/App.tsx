import { useRownd } from 'supertokens-rownd-react';

function App() {
  const { is_authenticated, access_token, user, requestSignIn, signOut } = useRownd();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>User Migration Example</h1>
      {is_authenticated ? (
        <div>
          <p>Signed in as: {user.data?.email as string}</p>
          <p>
            <strong>Access token:</strong>{' '}
            <code style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
              {access_token}
            </code>
          </p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <div>
          <p>Not signed in.</p>
          <button onClick={() => requestSignIn()}>Sign in</button>
        </div>
      )}
    </div>
  );
}

export default App;
