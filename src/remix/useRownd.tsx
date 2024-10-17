import { useMemo } from 'react';
import { TRowndContext } from '../context/types';
import { useRownd as useRowndDefault } from '../index';
import { setCookie } from './server/cookie';

const useRownd = (): TRowndContext => {
  const rowndDefault = useRowndDefault();

  const memoized = useMemo(
    () => ({
      ...rowndDefault,
      signOut: async () => {
        // Handle cookie before clearing state
        try {
          await setCookie('invalidate');
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
