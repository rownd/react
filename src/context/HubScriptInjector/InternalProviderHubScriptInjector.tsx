import React from 'react';
import { useInternalRownd } from '../InternalProvider';
import HubScriptInjector from './HubScriptInjector';

export default function InternalProviderHubScriptInjector() {
  const { appKey, hubUrlOverride, stateListener, ...rest } = useInternalRownd();

  return (
    <HubScriptInjector
      appKey={appKey}
      hubUrlOverride={hubUrlOverride}
      stateListener={stateListener}
      {...rest}
    />
  );
}
