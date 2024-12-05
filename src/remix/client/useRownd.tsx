import { useCallback, useMemo, useRef } from 'react';
import { TRowndContext, UserDataContext } from '../../context/types';
import { useRownd as useRowndDefault } from '../../index';
import { setCookie } from '../../ssr/server/cookie';
import { addOnAuthenticatedListener, unsubscribeOnAuthenticatedListener } from '../../utils/listeners';

const useRownd = (): TRowndContext => {
  const rowndDefault = useRowndDefault();

  const isFirstMount = useRef(true);
  const onAuthenticated: (
    callback: (userData: UserDataContext) => void
  ) => () => void = useCallback(
    (callback: (userData: UserDataContext) => void) => {

      // If the user is authenticated on the first mount, we want to call the callback immediately
      if (rowndDefault.is_authenticated && !rowndDefault.is_initializing && Boolean(rowndDefault.user.data.user_id) && isFirstMount.current) {
        callback(rowndDefault.user.data);
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
    [rowndDefault.is_authenticated, rowndDefault.is_initializing, rowndDefault.user.data.user_id]
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
