import React, { useEffect, useMemo, useState } from 'react';
import './Header.scss';
import { useRownd } from '@rownd/react';
import Pill from '../pill/Pill';
import MenuIcon from '../../assets/menu.svg';
import CloseIcon from '../../assets/close.svg';
import { Paths } from '../sidebar/SideBar';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { is_authenticated, auth_level, requestSignIn, signOut, user } =
    useRownd();

  const [showModal, setShowModal] = useState(false);

  const is_instant_user = is_authenticated && auth_level === 'instant';

  useEffect(() => {
    const handleBodyOverflow = (style?: 'hidden') => {
      document.body.style.overflow = style ?? 'auto';
    };
    handleBodyOverflow(showModal ? 'hidden' : undefined);
    return () => {
      handleBodyOverflow(undefined);
    };
  }, [showModal]);

  const name = useMemo(() => {
    const data = user.data;
    const firstName = data?.first_name;
    const lastName = data?.last_name;
    if (!firstName && !lastName) return undefined;
    if (!lastName) return `, ${firstName}`;
    if (!firstName) return `, ${lastName}`;
    return `, ${firstName} ${lastName}`;
  }, [user.data]);

  return (
    <>
      <header>
        <div className="title">
          <a href="/">Rownd Router</a>
          <Pill />
        </div>
        <div className="header__right">
          <div className="header__right__welcome">Welcome{name ?? ''}</div>
          {is_authenticated && !is_instant_user ? (
            <button onClick={() => signOut()}>Sign out</button>
          ) : (
            <button onClick={() => requestSignIn()}>Sign-in</button>
          )}
        </div>
        <div className="header__right--mobile">
          <button onClick={() => setShowModal((prev) => !prev)}>
            <img src={showModal ? CloseIcon : MenuIcon} />
          </button>
        </div>
      </header>
      {showModal && (
        <div className="menu">
          <ul>
            {Paths.map(({ path, title }) => (
              <li
                className={classNames({
                  active: path === location.pathname,
                })}
              >
                <Link onClick={() => setShowModal(false)} to={path}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
