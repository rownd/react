import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RowndProvider } from '../../../src/context/index';

const queryParams = new URLSearchParams(window.location.search);
const isIframe = queryParams.get('isIframe') === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RowndProvider appKey='key_avbbz54j39mtnuibeni4l8vs' hubUrlOverride='http://localhost:8787' apiUrl='http://localhost:3124' useIframeParent={isIframe}>
      <App />
    </RowndProvider>
  </StrictMode>,
)

if (!isIframe) {
  const iframe = document.createElement('iframe');
  iframe.src = `/`;
  iframe.style.width = '100%';
  iframe.style.height = '400px';
  document.body.appendChild(iframe);
}
