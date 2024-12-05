import { useEffect } from 'react';
import {
  RequireSignIn,
  useRownd,
} from '../../../src/context/index';
import './App.css';
import { Link } from 'react-router-dom';

const Initializing = () => <h1>Initializing...</h1>;

function App() {
  const { signOut, onAuthenticated } = useRownd();

  useEffect(() => {
    const unsubscribe = onAuthenticated((userData) => {
      console.log('ON AUTHENTICATED', userData);
    });

    return () => {
      unsubscribe();
    };
  }, [onAuthenticated]);

  return (
    <RequireSignIn initializing={<Initializing />}>
      <h1>Rownd sample app</h1>
      <Link to="/profile">Go to profile</Link>
      <button onClick={() => signOut()}>Sign out</button>
    </RequireSignIn>
  );
}

export default App;
