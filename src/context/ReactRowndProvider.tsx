import React, { useCallback, useEffect } from 'react';
import { RowndContext, RowndProviderProps } from './RowndContext';
import InternalProviderHubScriptInjector from './HubScriptInjector/InternalProviderHubScriptInjector';
import useHub from '../hooks/useHub';
import { TRowndContext, UserDataContext } from './types';
import { InternalRowndProvider } from './InternalProvider';
import {
  addOnAuthenticatedListener,
  getOnAuthenticatedListeners,
  unsubscribeOnAuthenticatedListener,
} from '../utils/listeners';

export const ReactRowndProvider: React.FC<RowndProviderProps> = ({
  children,
  ...props
}) => {
  const { setInitialHubState, hubListenerCb } = useHub();

  const onAuthenticated: (
    callback: (userData: UserDataContext) => void
  ) => () => void = useCallback(
    (callback: (userData: UserDataContext) => void) => {
      const id = addOnAuthenticatedListener(callback);

      const unsubscribe = () => {
        unsubscribeOnAuthenticatedListener(id);
      };

      return unsubscribe;
    },
    []
  );

  const [hubState, setHubState] = React.useState<TRowndContext>({
    ...setInitialHubState(),
    onAuthenticated,
  });

  const { user, is_authenticated, is_initializing } = hubState;
  useEffect(() => {
    if (!is_authenticated || is_initializing || !user.data.user_id) {
      return;
    }

    getOnAuthenticatedListeners().forEach(({ callback }) =>
      callback(hubState.user.data)
    );
  }, [is_authenticated, is_initializing, user.data.user_id]);

  return (
    <InternalRowndProvider
      stateListener={({ state, api }) =>
        hubListenerCb({ state, api, callback: setHubState })
      }
      {...props}
    >
      <RowndContext.Provider value={hubState}>
        <InternalProviderHubScriptInjector />
        {children}
      </RowndContext.Provider>
    </InternalRowndProvider>
  );
};
