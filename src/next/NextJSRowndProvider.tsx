'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { RowndProviderProps } from '../context/RowndProvider';
import HubScriptInjector from '../context/HubScriptInjector';

const RowndProviderDynamic = dynamic(
  () => import('../context/RowndProvider').then((mod) => mod.RowndProvider),
  {
    ssr: false,
  }
);

function NextJSRowndProvider({
  children,
  ...props
}: RowndProviderProps) {
  return (
    <RowndProviderDynamic {...props}>
      <HubScriptInjector />
      {children}
    </RowndProviderDynamic>
  );
}

export { NextJSRowndProvider };
