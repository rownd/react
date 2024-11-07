import React, { lazy, Suspense } from 'react';
import { RowndProviderProps } from '../context/RowndProvider';
const Client = lazy(() => import('./client'));

function RowndProvider({ children, ...props }: RowndProviderProps) {
  return (
    <>
      {/* @ts-ignore */}
      <Suspense fallback={null}>
        {/* @ts-ignore */}
        <Client {...props} />
      </Suspense>
      {children}
    </>
  );
}

export { RowndProvider };
