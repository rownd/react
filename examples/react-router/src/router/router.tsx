import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './welcome/Welcome.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import Header from './header/Header.tsx';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
