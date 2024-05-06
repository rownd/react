import './Welcome.css';
import { useRownd } from '@rownd/react';
import { Link } from 'react-router-dom';

function Welcome() {
  const { is_initializing, is_authenticated, auth_level, user } = useRownd();

  return (
    <>
      <h1>Welcome: {`${user.data.first_name ?? ''} ${user.data.last_name ?? ''}`}</h1>
      {is_initializing && <h2>Initializing...</h2>}
      {is_authenticated && (
        <>
          <h2>Auth level: {auth_level}</h2>
        </>
      )}
      <button id="request-info" onClick={() => {}}>
        Add/Edit name
      </button>
      <br />
      <br />
      <Link to={'/dashboard'}>Go to Dashboard</Link>
    </>
  );
}

export default Welcome;
