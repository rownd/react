export type Listener<T> = (state: T) => void;
export type Selector<T, U> = (state: T) => U;

export class Store<T extends object> {
  private state: T;
  private listeners: Set<Listener<T>>;

  constructor(initialState: T) {
    this.state = initialState;
    this.listeners = new Set();
  }

  getState(): T {
    return this.state;
  }

  setState(partial: Partial<T> | ((state: T) => Partial<T>)): void {
    const nextState =
      typeof partial === 'function' ? partial(this.state) : partial;

    this.state = { ...this.state, ...nextState };
    this.notify();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Selector support for optimized re-renders
  select<U>(selector: Selector<T, U>): U {
    return selector(this.state);
  }
}

// Helper function to create a store
export function createStore<T extends object>(initialState: T): Store<T> {
  return new Store(initialState);
}
