import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { TRowndContext } from './types';
import { InternalRowndProvider } from './InternalProvider';
import useHub from '../hooks/useHub';

const RowndContext = createContext<TRowndContext | undefined>(undefined);

export type HubListenerProps = {
  state: any;
  api: any;
};

export type RowndProviderProps = {
  appKey: string;
  apiUrl?: string;
  rootOrigin?: string;
  hubUrlOverride?: string;
  postRegistrationUrl?: string;
  postSignOutRedirect?: string;
  children: React.ReactNode;
};

function RowndProvider({ children, ...rest }: RowndProviderProps) {
  const { setInitialHubState, hubListenerCb } = useHub();

  const [hubState, setHubState] = React.useState<TRowndContext>(
    setInitialHubState()
  );

  return (
    <InternalRowndProvider
      stateListener={({ state, api }) =>
        hubListenerCb({ state, api, callback: setHubState })
      }
      {...rest}
    >
      <RowndContext.Provider value={hubState}>{children}</RowndContext.Provider>
    </InternalRowndProvider>
  );
}

RowndProvider.propTypes = {
  appKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function useRownd(): TRowndContext {
  const context = useContext(RowndContext);

  if (context === undefined) {
    throw new Error('useRownd must be used within a RowndProvider');
  }

  return context;
}

export { RowndProvider, useRownd };
