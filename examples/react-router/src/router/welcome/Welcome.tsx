import './Welcome.css';
import { useRownd } from '../../../../../src/index';
import { Link } from 'react-router-dom';

function Welcome() {
  const { is_initializing, is_authenticated, auth_level, user } = useRownd();

  return (
    <>
      <h1>Welcome</h1>
      {is_initializing && <h2>Initializing...</h2>}
      {user.instant_user?.is_initializing && (
        <h2>Initializing instant user...</h2>
      )}
      {is_authenticated && (
        <>
          <h2>Authenticated</h2>
          <h2>Auth level: {auth_level}</h2>
        </>
      )}
      <Link to={'/dashboard'}>Go to Dashboard</Link>
    </>
  );
}

export default Welcome;
