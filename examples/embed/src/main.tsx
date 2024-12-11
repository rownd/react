import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RowndProvider } from '../../../src/context/index';

const tmpNodeId = (Math.random() + 1).toString(36).substring(7);
const tmpNode = document.createElement('div');
tmpNode.id = tmpNodeId;
document.body.appendChild(tmpNode);

createRoot(tmpNode).render(
  <StrictMode>
    <RowndProvider appKey='key_avbbz54j39mtnuibeni4l8vs' hubUrlOverride='http://localhost:8787' apiUrl='http://localhost:3124'>
      <App />
    </RowndProvider> 
  </StrictMode>,
)
