import { useRownd } from '@rownd/react';
import React from 'react';
import './Pill.scss';
import Flash from '../../assets/flash.svg';
import Avatar from '../../assets/user--avatar.svg';
import AvatarFilled from '../../assets/user--avatar--filled.svg';
import Admin from '../../assets/user--admin.svg';

const Pill: React.FC = () => {
  const { auth_level, is_authenticated } = useRownd();
  const is_instant_user = is_authenticated && auth_level === 'instant';

  if (!auth_level) return null;

  return (
    <div className="pill">
      {is_instant_user && <img src={Flash} />}
      {auth_level === 'guest' && <img src={Avatar} />}
      {auth_level === 'unverified' && <img src={AvatarFilled} />}
      {auth_level === 'verified' && <img src={Admin} />}
      {auth_level[0].toUpperCase() + auth_level.slice(1)} User
    </div>
  );
};

export default Pill;
