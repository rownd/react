import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './welcome/Welcome.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import Header from '../common/header/Header.tsx';
import SideBar from '../common/sidebar/SideBar.tsx';
import './router.scss';
import User from './user/User.tsx';
import Settings from './settings/Settings.tsx';
import Blog from './blog/Blog.tsx';
import Support from './support/Support.tsx';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="router__content">
        <SideBar />
        <div className="router__content__routes">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<User />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Router;
