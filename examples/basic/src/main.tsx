import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RowndProvider } from '../../../src/context/index';
import {
  createBrowserRouter,
  Link,
  RouterProvider,
} from "react-router-dom";

const Profile: React.FC = () => {
  return <Link to="/">Go back</Link>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/profile",
    element: <Profile />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RowndProvider appKey="key_nmdccn7goxjch5s0hoholrh9">
      <RouterProvider router={router} />
    </RowndProvider>
  </React.StrictMode>
);
