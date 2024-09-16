import { useRef } from 'react';
import {
  SignedOut,
  RequireSignIn,
  SignedIn,
  useRownd,
} from '../../../src/context/index';
import './App.css';

const Initializing = () => <h1>Initializing...</h1>;

function App() {
  const { signOut, is_initializing } = useRownd();
  const template = useRef('2');

  if (template.current === '2') {
    if (is_initializing) {
      return <Initializing />;
    }

    return (
      <>
        <SignedIn>
          <h1>Rownd sample app</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </SignedIn>
        <SignedOut>
          <h1>Signed out</h1>
          <RequireSignIn />
        </SignedOut>
      </>
    );
  }

  return (
    <RequireSignIn initializing={<Initializing />}>
      <h1>Rownd sample app</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </RequireSignIn>
  );
}

export default App;
