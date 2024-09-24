'use client';

import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const RowndProviderDynamic = dynamic(
  () => import('../context/RowndProvider').then((mod) => mod.RowndProvider),
  {
    ssr: false,
  }
);

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
    <RowndProviderDynamic
      appKey={appKey}
      apiUrl={apiUrl}
      hubUrlOverride={hubUrlOverride}
    >
      {children}
    </RowndProviderDynamic>
  );
}

export { NextJSRowndProvider };
