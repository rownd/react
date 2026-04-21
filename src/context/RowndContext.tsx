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
  /**
   * API version date string (e.g., '2026-01-21') that controls which Hub features are enabled.
   * Defaults to the current SDK version date for new features.
   * Set to an earlier date to opt-out of newer behaviors.
   */
  apiVersion?: string;
  /**
   * SuperTokens application info. When set, the React SDK will call the
   * customer's migration endpoint after a Rownd sign-up completes.
   */
  supertokens?: {
    appInfo: { appName: string; apiDomain: string; apiBasePath: string };
  };
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
