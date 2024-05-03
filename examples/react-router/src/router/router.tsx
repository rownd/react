import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './welcome/Welcome.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import Header from './header/Header.tsx';

import { RequireSignIn } from '../../../../src/index.tsx';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path="/dashboard"
          element={
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <RequireSignIn>
              <Dashboard />
            </RequireSignIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
