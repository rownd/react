import React, { lazy, Suspense } from 'react';
import { RowndContext, RowndProviderProps } from '../context/RowndContext';
import useHub from '../hooks/useHub';
import { TRowndContext } from '../context/types';
import { InternalRowndProvider } from '../context/InternalProvider';
const InternalProviderHubScriptInjector = lazy(
  () => import('../context/HubScriptInjector/InternalProviderHubScriptInjector')
);
const RemixClientScript = lazy(() => import('./client/RemixClientScript'));

function RemixRowndProvider({ children, ...props }: RowndProviderProps) {
  const { setInitialHubState, hubListenerCb } = useHub();

  const [hubState, setHubState] = React.useState<TRowndContext>({
    ...setInitialHubState(),
    onAuthenticated: () => {
      return () => void 0;
    },
  });

  return (
    <InternalRowndProvider
      stateListener={({ state, api }) =>
        hubListenerCb({ state, api, callback: setHubState })
      }
      {...props}
    >
      <RowndContext.Provider value={hubState}>
        <Suspense fallback={null}>
          <InternalProviderHubScriptInjector />
          <RemixClientScript />
        </Suspense>
        {children}
      </RowndContext.Provider>
    </InternalRowndProvider>
  );
}

export { RemixRowndProvider };
