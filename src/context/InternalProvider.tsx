import React, { useContext, createContext } from 'react';
import { HubScriptInjectorProps } from './HubScriptInjector/HubScriptInjector';

const InternalRowndContext = createContext<HubScriptInjectorProps | undefined>(undefined);

type InternalRowndProvider = HubScriptInjectorProps & { children: React.ReactNode }

export const InternalRowndProvider = ({ children, ...rest }: InternalRowndProvider) => {
  return (
    <InternalRowndContext.Provider value={rest}>      
      {children}
    </InternalRowndContext.Provider>
  );
}

export function useInternalRownd(): HubScriptInjectorProps {
  const context = useContext(InternalRowndContext);

  if (context === undefined) {
    throw new Error('useInternalRownd must be used within a InternalRowndProvider');
  }

  return context;
}
