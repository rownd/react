import React, { lazy, Suspense } from 'react';
import { RowndProvider, RowndProviderProps } from '../context/RowndProvider';
const InternalProviderHubScriptInjector = lazy(() => import('../context/HubScriptInjector/InternalProviderHubScriptInjector'));
const RemixClientScript = lazy(() => import('./RemixClientScript'));

function RemixRowndProvider({ children, ...props }: RowndProviderProps) {
  return (
    <RowndProvider {...props}>
      <Suspense fallback={null}>
        <InternalProviderHubScriptInjector />
        <RemixClientScript />
      </Suspense>
      {children}
    </RowndProvider>
  );
}

export { RemixRowndProvider };
