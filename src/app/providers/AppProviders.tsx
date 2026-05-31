import React, { ReactNode } from 'react';
import { RouterProvider } from '../router/RouterProvider';
import { NexusAlertProvider } from '../../components/NexusAlertContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <RouterProvider>
      <NexusAlertProvider>
        {children}
      </NexusAlertProvider>
    </RouterProvider>
  );
}
