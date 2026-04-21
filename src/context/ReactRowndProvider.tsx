import React, { useCallback, useEffect, useRef } from 'react';
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
import { syncUserToSuperTokens } from '../utils/supertokens-sync';

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

  const stateListener = useCallback(
    ({ state, api }) => {
      hubListenerCb({ state, api, callback: setHubState });
    },
    [hubListenerCb]
  );

  // Only sync new sign ups
  const shouldSyncToSuperTokens = useRef(false);
  useEffect(() => {
    const handleSignInCompleted = (event: Event) => {
      console.log('sign in completed');
      const detail = (event as CustomEvent<{ user_type?: string }>).detail;

      if (detail?.user_type === 'new_user') {
        shouldSyncToSuperTokens.current = true;
      }
    };
    console.log('registering listener');

    hubState.events.addEventListener(
      'sign_in_completed',
      handleSignInCompleted
    );

    return () => {
      hubState.events.removeEventListener(
        'sign_in_completed',
        handleSignInCompleted
      );
    };
  }, [hubState.events]);

  useEffect(() => {
    const accessToken = hubState.access_token;
    const appInfo = props.supertokens?.appInfo;
    if (!accessToken || !appInfo || !shouldSyncToSuperTokens.current) {
      return;
    }

    shouldSyncToSuperTokens.current = false;
    syncUserToSuperTokens(accessToken, appInfo).catch(() => {});
  }, [hubState.access_token, props.supertokens]);

  return (
    <InternalRowndProvider stateListener={stateListener} {...props}>
      <RowndContext.Provider value={hubState}>
        <InternalProviderHubScriptInjector />
        {children}
      </RowndContext.Provider>
    </InternalRowndProvider>
  );
};
