import React from 'react';
import { RowndProvider, RowndProviderProps } from './RowndProvider';
import HubScriptInjector from './HubScriptInjector';

export const ReactRowndProvider: React.FC<RowndProviderProps> = ({
  children,
  ...props
}) => {
  return (
    <RowndProvider {...props}>
      <HubScriptInjector />
      {children}
    </RowndProvider>
  );
};
