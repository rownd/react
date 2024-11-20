import React, { lazy, Suspense } from 'react';
import { RowndProviderProps } from '../context/RowndContext';
const Client = lazy(() => import('./client'));

function RowndProvider({ children, ...props }: RowndProviderProps) {
  return (
    <>
      <Suspense fallback={null}>
        <Client {...props} />
      </Suspense>
      {children}
    </>
  );
}

export { RowndProvider };
