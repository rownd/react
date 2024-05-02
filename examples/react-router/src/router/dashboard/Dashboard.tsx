import React from 'react';
import { Link } from 'react-router-dom';
import { useRownd } from '../../../../../src/index.tsx';

const Dashboard: React.FC = () => {
  const { is_authenticated, auth_level } = useRownd();
  return (
    <>
      <h1>Dashboard</h1>
      {is_authenticated && (
        <>
          <h2>Authenticated</h2>
          <h2>Auth level: {auth_level}</h2>
        </>
      )}
      <br />
      <br />
      <Link to={'/'}>Go to welcome</Link>
    </>
  );
};

export default Dashboard;
