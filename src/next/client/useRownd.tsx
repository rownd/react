import { useStore } from './store/useStore';
import { store } from './store';
import { TRowndContext } from '../../context/types';

export const useRownd = (): TRowndContext => {
  const state = useStore(store, (x) => x);

  return state;
};
