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
import {
  normalizeSuperTokensAppInfo,
  syncUserToSuperTokens,
} from '../utils/supertokens-sync';

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
  const accessTokenRef = useRef<string | null>(hubState.access_token);
  const supertokensAppInfoRef = useRef(
    normalizeSuperTokensAppInfo(props.supertokens?.appInfo)
  );

  const { user, is_authenticated, is_initializing } = hubState;
  useEffect(() => {
    accessTokenRef.current = hubState.access_token;
  }, [hubState.access_token]);

  useEffect(() => {
    supertokensAppInfoRef.current = normalizeSuperTokensAppInfo(
      props.supertokens?.appInfo
    );
  }, [props.supertokens]);

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

  useEffect(() => {
    const handleSignInCompleted = (event: Event) => {
      const detail = (event as CustomEvent<{ user_type?: string }>).detail;

      if (detail?.user_type !== 'new_user') {
        return;
      }

      const accessToken = accessTokenRef.current;
      const appInfo = supertokensAppInfoRef.current;
      if (!accessToken || !appInfo) {
        return;
      }

      syncUserToSuperTokens(accessToken, appInfo).catch(() => {});
    };

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

  return (
    <InternalRowndProvider stateListener={stateListener} {...props}>
      <RowndContext.Provider value={hubState}>
        <InternalProviderHubScriptInjector />
        {children}
      </RowndContext.Provider>
    </InternalRowndProvider>
  );
};
