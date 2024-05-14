import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideBar.scss';
import classNames from 'classnames';

// eslint-disable-next-line react-refresh/only-export-components
export const Paths = [
  {
    path: '/',
    title: 'Home',
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
  },
  {
    path: '/user',
    title: 'User details',
  },
  {
    path: '/settings',
    title: 'Settings',
  },
  {
    path: '/support',
    title: 'Support',
  },
  {
    path: '/blog',
    title: 'Blog',
  },
];

const SideBar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul>
        {Paths.map(({ path, title }) => (
          <li
            className={classNames({
              active: path === location.pathname,
            })}
          >
            <Link to={path}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
