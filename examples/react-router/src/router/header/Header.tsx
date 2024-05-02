import React from 'react';
import './Header.css';
import { useRownd } from '../../../../../src';

const Header: React.FC = () => {
  const { is_authenticated, auth_level, requestSignIn, signOut } = useRownd();

  const is_instant_user = is_authenticated && auth_level === 'instant';

  return (
    <header>
      <h2>Rownd Router</h2>
      {is_authenticated && !is_instant_user ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => requestSignIn()}>Sign-in</button>
      )}
    </header>
  );
};

export default Header;
