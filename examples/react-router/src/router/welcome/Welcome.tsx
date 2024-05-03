import './Welcome.css';
import { useRownd } from '@rownd/react';
import { Link } from 'react-router-dom';
import { adjectives, uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

function Welcome() {
  const { is_initializing, is_authenticated, auth_level, user, setUser} = useRownd();

  return (
    <>
      <h1>Welcome: {user.data.unique_name || 'new person'}</h1>
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
      <h2>{'Random name generator'}</h2>
      <button onClick={() => {
        const randomName= uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals]
        }); 
        setUser({
          ...user.data,
          unique_name: randomName.split('_').join(' '),
          email: `${crypto.randomUUID().slice(0,10)}@random.com`,
        })
        console.log({ randomName })
      }}>Generate new name</button>
      <br />
      <br />
      <Link to={'/dashboard'}>Go to Dashboard</Link>
    </>
  );
}

export default Welcome;
