'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { RowndProviderProps } from '../../context/RowndProvider';
import { store } from './store';
import HubScriptInjector from '../../context/HubScriptInjector/HubScriptInjector';
import useHub from '../../hooks/useHub';
import { TRowndContext } from '../../context/types';
import useCookie from '../../ssr/hooks/useCookie';
import { useRownd } from './useRownd';

const Client: React.FC<Omit<RowndProviderProps, 'children'>> = (props) => {
  const { setInitialHubState, hubListenerCb } = useHub();

  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    store.setState(setInitialHubState());
    hasInitialized.current = true;
  }, []);

  const setState: (
    partial:
      | Partial<TRowndContext>
      | ((state: TRowndContext) => Partial<TRowndContext>)
  ) => void = useCallback(
    (partial) => {
      store.setState(partial);
    },
    [store]
  );

  const { access_token, is_initializing } = useRownd();
  const { cookieSignIn, cookieSignOut } = useCookie(useRownd);

  // Listen for access_token changes to determine when to sign(In/Out) cookies and state.
  const prevAccessToken = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (is_initializing || prevAccessToken.current === access_token) return;

    prevAccessToken.current = access_token;

    if (!access_token) {
      cookieSignOut();
      return;
    }

    cookieSignIn();
  }, [is_initializing, access_token, cookieSignOut, cookieSignIn]);

  return (
    <>
      <HubScriptInjector
        stateListener={({ state, api }) =>
          hubListenerCb({
            state,
            api,
            callback: setState,
          })
        }
        {...props}
      />
    </>
  );
};

export default Client;
