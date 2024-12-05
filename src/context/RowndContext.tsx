import React, {
  useContext,
  createContext,
  useRef,
  useCallback,
} from 'react';
import { TRowndContext, Unsubscribe, UserDataContext } from './types';

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

  // If the user is authenticated on the first mount, we want to call the callback immediately
  const isFirstMount = useRef(true);
  const onAuthenticated = useCallback(
    (callback: (userData: UserDataContext) => void): Unsubscribe => {
      if (
        context.is_authenticated &&
        !context.is_initializing &&
        context.user.data.user_id &&
        isFirstMount.current
      ) {
        callback(context.user.data);
        isFirstMount.current = false;
        return () => {};
      }
      isFirstMount.current = false;
      return context.onAuthenticated(callback);
    },
    [context.is_authenticated, context.is_initializing, context.user?.data?.user_id]
  );

  return {
    ...context,
    onAuthenticated,
  };
}

export { useRownd };
