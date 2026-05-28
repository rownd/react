import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { RowndProvider } from '@rownd/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RowndProvider
      appKey="key_neararrumhj5vnsunt6wi92v"
      supertokens={{
        appInfo: {
          appName: 'User Migration Example',
          apiDomain: 'http://localhost:3001',
          apiBasePath: '/auth',
        },
      }}
    >
      <App />
    </RowndProvider>
  </React.StrictMode>
);
