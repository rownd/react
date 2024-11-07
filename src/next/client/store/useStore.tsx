import { useEffect, useState } from 'react';
import { Store, Selector } from './store';

export function useStore<T extends object, U>(
  store: Store<T>,
  selector?: Selector<T, U>
) {
  const [state, setState] = useState(() => 
    selector ? store.select(selector) : store.getState()
  );

  useEffect(() => {
    return store.subscribe((newState) => {
      setState(selector ? selector(newState) : newState);
    });
  }, [store, selector]);

  return state;
}