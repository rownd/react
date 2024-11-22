import React, { useContext, createContext } from 'react';
import { TRowndContext } from './types';

export const RowndContext = createContext<TRowndContext | undefined>(undefined);

export type HubListenerProps = {
  state: any;
  api: any;
};

export type RowndProviderProps = {
  appKey: string;
  apiUrl?: string;
  rootOrigin?: string;
  hubUrlOverride?: string;
  postRegistrationUrl?: string;
  postSignOutRedirect?: string;
  children: React.ReactNode;
};

function useRownd(): TRowndContext {
  const context = useContext(RowndContext);

  if (context === undefined) {
    throw new Error('useRownd must be used within a RowndProvider');
  }

  return context;
}

export { useRownd };
