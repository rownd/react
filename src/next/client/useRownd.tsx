'use client';

import { useStore } from './store/useStore';
import { store } from './store';
import { TRowndContext, UserDataContext } from '../../context/types';
import { useCallback, useMemo, useRef } from 'react';
import { setCookie } from '../../ssr/server/cookie';
import { addOnAuthenticatedListener, unsubscribeOnAuthenticatedListener } from '../../utils/listeners';

export const useRownd = (): TRowndContext => {
  const state = useStore(store, (x) => x);

  const isFirstMount = useRef(true);
  const onAuthenticated: (
    callback: (userData: UserDataContext) => void
  ) => () => void = useCallback(
    (callback: (userData: UserDataContext) => void) => {
      if (state.is_authenticated && !state.is_initializing && Boolean(state.user.data.user_id) && isFirstMount.current) {
        callback(state.user.data);
        isFirstMount.current = false;
        return () => {};
      }

      isFirstMount.current = false;
      const id = addOnAuthenticatedListener(callback);

      const unsubscribe = () => {
        unsubscribeOnAuthenticatedListener(id);
      };

      return unsubscribe;
    },
    [state.is_authenticated, state.is_initializing, state.user?.data?.user_id]
  );

  const memoized = useMemo(() => {
    return {
      ...state,
      onAuthenticated,
      signOut: async () => {
        try {
          await setCookie('invalid');
        } catch (err) {
          console.log('Failed to set sign out cookie: ', err);
        }
        state.signOut();
      },
    };
  }, [state]);

  return memoized;
};
