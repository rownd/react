import React from 'react';
import { RowndProvider, RowndProviderProps } from '../context/RowndProvider';
import InternalProviderHubScriptInjector from '../context/HubScriptInjector/InternalProviderHubScriptInjector';

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
