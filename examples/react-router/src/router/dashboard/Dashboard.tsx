import { Link } from 'react-router-dom';
import { RequireSignIn, useRownd } from '../../../../../src/index.tsx';

const Dashboard = () => {
  const { is_authenticated, auth_level, signOut } = useRownd();
  return (
    <>
      <h1>Dashboard</h1>
      {is_authenticated ? (
        <>
          <h2>Authenticated</h2>
          <h2>Auth level: {auth_level}</h2>
        </>
      ) : (
        <h2>Un-authenticated</h2>
      )}
      <button onClick={() => signOut()}>Sign-out</button>
      <br />
      <br />
      <Link to={'/'}>Go home</Link>
      <RequireSignIn />
    </>
  );
};

export default Dashboard;
