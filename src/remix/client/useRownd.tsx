import { useCallback, useMemo } from 'react';
import { TRowndContext, UserDataContext } from '../../context/types';
import { useRownd as useRowndDefault } from '../../index';
import { setCookie } from '../../ssr/server/cookie';
import { addOnAuthenticatedListener, unsubscribeOnAuthenticatedListener } from '../../utils/listeners';

const useRownd = (): TRowndContext => {
  const rowndDefault = useRowndDefault();

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

  const memoized = useMemo(
    () => ({
      ...rowndDefault,
      onAuthenticated,
      signOut: async () => {
        // Handle cookie before clearing state
        try {
          await setCookie('invalid');
        } catch (err) {
          console.log('Failed to set sign out cookie: ', err);
        }
        rowndDefault.signOut();
      },
    }),
    [rowndDefault]
  );
  return memoized;
};

export { useRownd };
