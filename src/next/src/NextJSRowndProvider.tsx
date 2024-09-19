'use client';

import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { RowndProvider } from '../../context/RowndProvider';

// const RowndProviderDynamic = dynamic(
//   () => import('../../context/RowndProvider').then((mod) => mod.RowndProvider),
//   {
//     ssr: false,
//   }
// );

interface NextJSRowndProviderProps {
  appKey: string;
  apiUrl?: string;
  hubUrlOverride?: string;
  children: ReactNode;
}

function NextJSRowndProvider({
  children,
  appKey,
  apiUrl,
  hubUrlOverride,
}: NextJSRowndProviderProps) {
  return (
    <RowndProvider
      appKey={appKey}
      apiUrl={apiUrl}
      hubUrlOverride={hubUrlOverride}
    >
      {children}
    </RowndProvider>
  );
}

export { NextJSRowndProvider };
