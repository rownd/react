import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RowndProvider } from '../../../src/context/index';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RowndProvider appKey="YOUR APP KEY">
      <App />
    </RowndProvider>
  </React.StrictMode>
);
