import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'

import { RowndProvider } from '@rownd/react'
import Router from './router/router.tsx'
import { environment } from './environment.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RowndProvider 
      apiUrl={environment.API_URL}
      hubUrlOverride={environment.HUB_BASE_URL}
      appKey={environment.ROWND_APP_KEY}
    >
      <Router />
    </RowndProvider>
  </React.StrictMode>,
)
