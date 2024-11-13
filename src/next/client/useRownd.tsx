import { useStore } from './store/useStore';
import { store } from './store';
import { TRowndContext } from '../../context/types';
import { useMemo } from 'react';
import { setCookie } from '../../ssr/server/cookie';

export const useRownd = (): TRowndContext => {
  const state = useStore(store, (x) => x);

  const memoized = useMemo(() => {
    return {
      ...state,
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
