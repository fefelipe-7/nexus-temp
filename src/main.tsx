import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { NexusAlertProvider } from './components/NexusAlertContext.tsx';
import { RouterProvider } from './components/RouterContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <NexusAlertProvider>
        <App />
      </NexusAlertProvider>
    </RouterProvider>
  </StrictMode>,
);

