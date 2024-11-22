import { UserDataContext } from '../context/types';

let onAuthenticatedListeners: {
  id: string;
  callback: (userData: UserDataContext) => void;
}[] = [];

export const unsubscribeOnAuthenticatedListener = (id: string) => {
  onAuthenticatedListeners = onAuthenticatedListeners.filter(
    (listener) => listener.id !== id
  );
};

export const addOnAuthenticatedListener = (
  callback: (userData: UserDataContext) => void
): string => {
  const id = Math.random().toString(36).substring(2, 15);
  onAuthenticatedListeners.push({ id, callback });
  return id;
};

export const getOnAuthenticatedListeners = () => onAuthenticatedListeners;  
