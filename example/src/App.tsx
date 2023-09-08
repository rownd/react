import { TriggerSignIn, useRownd } from '../../src/context/index';
import './App.css';

function App() {
  const { signOut, requestSignIn } = useRownd();
  
  return (
    <TriggerSignIn
      components={{
        Initializing: <h1>Initializing...</h1>,
        Unauthenticated: (
          <button onClick={() => requestSignIn()}>Sign in</button>
        ),
      }}
    >
      <h1>Rownd sample app</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </TriggerSignIn>
  );
}

export default App;
