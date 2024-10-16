import React, { useContext, createContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { TRowndContext } from './types';
import { InternalRowndProvider } from './InternalProvider';

const RowndContext = createContext<TRowndContext | undefined>(undefined);

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
        fnNames?.filter((x) => x !== firstKey)
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

  const addEventListener = useCallback(
    (...args: any[]) => callHubApi(['events', 'addEventListener'], ...args),
    [callHubApi]
  );

  const removeEventListener = useCallback(
    (...args: any[]) => callHubApi(['events', 'removeEventListener'], ...args),
    [callHubApi]
  );

  const getAppConfig = useCallback(
    () => callHubApi(['getAppConfig']),
    [callHubApi]
  );

  const registerPasskey = useCallback(
    (...args: any[]) =>
      callHubApi(['auth', 'passkeys', 'promptForPasskeyRegistration'], ...args),
    [callHubApi]
  );

  const authenticatePasskey = useCallback(
    (...args: any[]) =>
      callHubApi(['auth', 'passkeys', 'authenticate'], ...args),
    [callHubApi]
  );

  const [hubState, setHubState] = React.useState<TRowndContext>({
    requestSignIn,
    getAccessToken,
    signOut,
    manageAccount,
    passkeys: {
      register: registerPasskey,
      authenticate: authenticatePasskey,
    },
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
    events: {
      addEventListener,
      removeEventListener,
    },
    user: {
      data: {},
      groups: [],
      redacted_fields: [],
      verified_data: {},
      meta: {},
      instant_user: {
        is_initializing: false,
      },
      is_loading: false,
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
      setHubState((prev) => ({
        ...prev,
        ...{
          is_initializing: state.is_initializing,
          is_authenticated: !!state.auth?.access_token,
          auth_level: state.auth.auth_level,
          access_token: state.auth?.access_token || null,
          auth: {
            access_token: state.auth?.access_token,
            app_id: state.auth?.app_id,
            is_authenticated: !!state.auth?.access_token,
            is_verified_user: state.auth?.is_verified_user,
            auth_level: state.auth.auth_level,
          },
          user: {
            ...state.user,
            instant_user: {
              is_initializing: Boolean(
                state.user?.instant_user?.is_initializing
              ),
            },
            is_loading: Boolean(state.user.is_loading),
          },
        },
      }));
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
      registerPasskey,
      authenticatePasskey,
      setUser,
      setUserValue,
    ]
  );

  return (
    <InternalRowndProvider stateListener={hubListenerCb} {...rest}>
      <RowndContext.Provider value={hubState}>      
        {children}
      </RowndContext.Provider>
    </InternalRowndProvider>
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
