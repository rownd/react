'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { RowndProviderProps } from '../context/RowndProvider';

const ReactRowndProvider = dynamic(
  () => import('../context/ReactRowndProvider').then((mod) => mod.ReactRowndProvider),
  {
    ssr: false,
  }
);

function NextJSRowndProvider({
  children,
  ...props
}: RowndProviderProps) {
  return (
    <ReactRowndProvider {...props}>
      {children}
    </ReactRowndProvider>
  );
}

export { NextJSRowndProvider };
