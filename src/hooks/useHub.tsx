import { useCallback, useRef } from 'react';
import { TRowndContext } from '../context/types';

type HubListenerInternalCallback = (prevState: TRowndContext) => TRowndContext;

type HubListenerCallback = {
  state: any;
  api: any;
  callback: (e: HubListenerInternalCallback) => void;
};

const useHub = () => {
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

  const setInitialHubState = useCallback(() => {
    return {
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
      events: {
        addEventListener,
        removeEventListener,
      },
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
        instant_user: {
          is_initializing: false,
        },
        is_loading: false,
      },
    };
  }, [
    requestSignIn,
    getAccessToken,
    signOut,
    manageAccount,
    registerPasskey,
    authenticatePasskey,
    setUser,
    setUserValue,
    getFirebaseIdToken,
    getAppConfig,
    addEventListener,
    removeEventListener,
  ]);

  const hubListenerCb = useCallback(
    ({ state, api, callback }: HubListenerCallback) => {
      hubApi.current = api;
      callback((prev) => ({
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
      flushApiQueue();
    },
    [flushApiQueue]
  );

  return {
    setInitialHubState,
    hubListenerCb,
  };
};

export default useHub;
