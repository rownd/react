import React, { lazy, Suspense } from 'react';
import { RowndProvider, RowndProviderProps } from '../context/RowndProvider';
const HubScriptInjector = lazy(() => import('../context/HubScriptInjector'));
const RemixClientScript = lazy(() => import('./RemixClientScript'));

function RemixRowndProvider({ children, ...props }: RowndProviderProps) {
  return (
    <RowndProvider {...props}>
      <Suspense fallback={null}>
        <HubScriptInjector />
        <RemixClientScript />
      </Suspense>
      {children}
    </RowndProvider>
  );
}

export { RemixRowndProvider };
