import React, { useContext, createContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import HubScriptInjector from './HubScriptInjector';
import { TRowndContext } from './types';

// Grab the URL hash ASAP in case it contains an `rph_init` param
const locationHash =
  typeof window !== 'undefined' ? window?.location?.hash : void 0;

const RowndContext = createContext<TRowndContext | undefined>(undefined);

export type HubListenerProps = {
  state: any;
  api: any;
};

interface RowndProviderProps {
  appKey: string;
  apiUrl?: string;
  rootOrigin?: string;
  hubUrlOverride?: string;
  postRegistrationUrl?: string;
  children: React.ReactNode;
}

function RowndProvider({ children, ...rest }: RowndProviderProps) {
  const hubApi = useRef<{ [key: string]: any } | null>(null);
  const apiQueue = useRef<{ fnNames: string[]; args: any[] }[]>([]);

  const selectHubApi = useCallback(
    (obj: { [key: string]: any } | null, fnNames: string[]): any => {
      if (fnNames.length === 1 || obj === undefined) {
        return obj?.[fnNames[0]];
      }

      const firstKey = fnNames[0];
      return selectHubApi(
        obj?.[firstKey],
        fnNames?.filter(x => x !== firstKey)
      );
    },
    []
  );

  const callHubApi = useCallback(
    (fnNames: string[], ...args: any[]) => {
      const selectedHubApi = selectHubApi(hubApi.current, fnNames);
      if (selectedHubApi) {
        return selectedHubApi(...args);
      }

      apiQueue.current.push({ fnNames, args });
    },
    [hubApi, selectHubApi]
  );

  const requestSignIn = useCallback(
    (...args: any[]) => callHubApi(['requestSignIn'], ...args),
    [callHubApi]
  );
  const getAccessToken = useCallback(
    (...args: any[]): Promise<string | undefined | null> =>
      callHubApi(['getAccessToken'], ...args),
    [callHubApi]
  );
  const signOut = useCallback(
    (...args: any[]) => callHubApi(['signOut'], ...args),
    [callHubApi]
  );
  const manageAccount = useCallback(
    (...args: any[]) => callHubApi(['user', 'manageAccount'], ...args),
    [callHubApi]
  );
  const setUser = useCallback(
    (...args: any[]) => callHubApi(['user', 'set'], ...args),
    [callHubApi]
  );
  const setUserValue = useCallback(
    (...args: any[]) => callHubApi(['user', 'setValue'], ...args),
    [callHubApi]
  );
  const getFirebaseIdToken = useCallback(
    (...args: any[]) => callHubApi(['firebase', 'getIdToken'], ...args),
    [callHubApi]
  );

  const getAppConfig = useCallback(() => callHubApi(['getAppConfig']), [callHubApi]);

  const [hubState, setHubState] = React.useState<TRowndContext>({
    requestSignIn,
    getAccessToken,
    signOut,
    manageAccount,
    setUser,
    setUserValue,
    getFirebaseIdToken,
    getAppConfig,
    is_initializing: true,
    is_authenticated: false,
    access_token: null,
    auth: {
      access_token: null,
      is_authenticated: false,
    },
    user: {
      data: {},
      groups: [],
      redacted_fields: [],
      verified_data: {},
      meta: {},
    },
  });

  const flushApiQueue = useCallback(() => {
    // Flush the call stack if needed
    if (!apiQueue.current.length) {
      return;
    }

    for (const { fnNames, args } of apiQueue.current) {
      const selectedHubApi = selectHubApi(hubApi.current, fnNames);
      if (!selectedHubApi) {
        return;
      }

      selectedHubApi(...args);
    }

    apiQueue.current.length = 0;
  }, [apiQueue, selectHubApi]);

  const hubListenerCb = useCallback(
    ({ state, api }: HubListenerProps) => {
      const transformedState: TRowndContext = {
        // functions
        requestSignIn,
        getAccessToken,
        signOut,
        manageAccount,
        setUser,
        setUserValue,
        getFirebaseIdToken,
        getAppConfig,
        // data
        is_initializing: state.is_initializing,
        is_authenticated: !!state.auth?.access_token,
        access_token: state.auth?.access_token || null,
        auth: {
          access_token: state.auth?.access_token,
          app_id: state.auth?.app_id,
          is_authenticated: !!state.auth?.access_token,
          is_verified_user: state.auth?.is_verified_user,
        },
        user: {
          ...state.user,
        },
      };

      setHubState(transformedState);
      hubApi.current = api;

      flushApiQueue();
    },
    [
      flushApiQueue,
      getAccessToken,
      requestSignIn,
      signOut,
      getFirebaseIdToken,
      manageAccount,
      setUser,
      setUserValue,
    ]
  );

  if (window?.localStorage.getItem('rph_log_level') === 'debug') {
    console.debug('[debug] rph_txstate:', hubState);
  }

  return (
    <RowndContext.Provider value={hubState}>
      <HubScriptInjector
        stateListener={hubListenerCb}
        locationHash={locationHash}
        {...rest}
      />
      {children}
    </RowndContext.Provider>
  );
}

RowndProvider.propTypes = {
  appKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function useRownd(): TRowndContext {
  const context = useContext(RowndContext);

  if (context === undefined) {
    throw new Error('useRownd must be used within a RowndProvider');
  }

  return context;
}

export { RowndProvider, useRownd };
