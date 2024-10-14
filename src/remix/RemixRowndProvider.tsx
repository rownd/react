import React, { lazy, Suspense } from 'react';
import { RowndProvider, RowndProviderProps } from '../context/RowndProvider';
const HubScriptInjector = lazy(() => import('../context/HubScriptInjector'));

function RemixRowndProvider({ children, ...props }: RowndProviderProps) {
  return (
    <RowndProvider {...props}>
      <Suspense fallback={null}>
        <HubScriptInjector />
      </Suspense>
      {children}
    </RowndProvider>
  );
}

export { RemixRowndProvider };
