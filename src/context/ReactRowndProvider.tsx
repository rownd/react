import React from 'react';
import { RowndProvider, RowndProviderProps } from './RowndProvider';
import InternalProviderHubScriptInjector from './HubScriptInjector/InternalProviderHubScriptInjector';

export const ReactRowndProvider: React.FC<RowndProviderProps> = ({
  children,
  ...props
}) => {
  return (
    <RowndProvider {...props}>
      <InternalProviderHubScriptInjector />
      {children}
    </RowndProvider>
  );
};
