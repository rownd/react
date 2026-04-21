import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { RowndProvider } from 'supertokens-rownd-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RowndProvider
      appKey="<APP_KEY>"
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
