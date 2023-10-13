import React, { useContext, createContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import HubScriptInjector from './HubScriptInjector';
import { TRowndContext } from './types';

// Grab the URL hash ASAP in case it contains an `rph_init` param
const locationHash =
  typeof window !== 'undefined' ? window?.location?.hash : void 0;

const RowndContext = createContext<TRowndContext | undefined>(undefined);

type HubListenerProps = {
  state: any;
  api: any;
};

interface RowndProviderProps {
  appKey: string;
  apiUrl?: string;
  rootOrigin?: string;
  baseUrl?: string;
  postRegistrationUrl?: string;
  children: React.ReactNode;
}

function RowndProvider({ children, ...rest }: RowndProviderProps) {
  const hubApi = useRef<{ [key: string]: any } | null>(null);
  const apiQueue = useRef<{ fnNames: string[]; args: any[] }[]>([]);

  let selectHubApi = useCallback((obj: { [key: string]: any } | null, fnNames: string[]): any => {
    if (fnNames.length === 1 || obj === undefined) {
      return obj?.[fnNames[0]];
    }
  
    const firstKey = fnNames[0];
    return selectHubApi(obj?.[firstKey], fnNames?.filter((x) => x !== firstKey));
  }, [])

  let callHubApi = useCallback(
    (fnNames: string[], ...args: any[]) => {
      const selectedHubApi = selectHubApi(hubApi.current, fnNames);
      if (selectedHubApi) {
        return selectedHubApi(...args);
      }

      apiQueue.current.push({ fnNames, args });
    },
    [hubApi]
  );

  let requestSignIn = useCallback(
    (...args: any[]) => callHubApi(['requestSignIn'], ...args),
    [callHubApi]
  );
  let getAccessToken = useCallback(
    (...args: any[]): Promise<string | undefined | null> => callHubApi(['getAccessToken'], ...args),
    [callHubApi]
  );
  let signOut = useCallback(
    (...args: any[]) => callHubApi(['signOut'], ...args),
    [callHubApi]
  );
  let manageAccount = useCallback(
    (...args: any[]) => callHubApi(['user','manageAccount'], ...args),
    [callHubApi]
  );
  let setUser = useCallback(
    (...args: any[]) => callHubApi(['user','set'], ...args),
    [callHubApi]
  );
  let setUserValue = useCallback(
    (...args: any[]) => callHubApi(['user','setValue'], ...args),
    [callHubApi]
  );

  let [hubState, setHubState] = React.useState<TRowndContext>({
    requestSignIn,
    getAccessToken,
    signOut,
    manageAccount,
    setUser,
    setUserValue,
    is_initializing: true,
    is_authenticated: false,
    access_token: null,
    auth: {
      access_token: null,
      is_authenticated: false,
    },
    user: {
      data: {},
      redacted_fields: [],
    },
  });

  const flushApiQueue = useCallback(() => {
    // Flush the call stack if needed
    if (!apiQueue.current.length) {
      return;
    }

    for (let { fnNames, args } of apiQueue.current) {
      const selectedHubApi = selectHubApi(hubApi.current, fnNames)
      if (!selectedHubApi) {
        return;
      }

      selectedHubApi(...args);
    }

    apiQueue.current.length = 0;
  }, [apiQueue]);

  let hubListenerCb = useCallback(
    ({ state, api }: HubListenerProps) => {
      let transformedState: TRowndContext = {
        // functions
        requestSignIn,
        getAccessToken,
        signOut,
        manageAccount,
        setUser,
        setUserValue,
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
    [flushApiQueue, getAccessToken, requestSignIn, signOut]
  );

  console.debug('rph_txstate:', hubState);

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
