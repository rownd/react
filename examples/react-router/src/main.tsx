import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { RowndProvider } from '../../../src/index.tsx'
import Router from './router/router.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RowndProvider appKey='key_bec29kgy4l1zu14vwy63rq62'>
      <Router />
    </RowndProvider>
  </React.StrictMode>,
)
