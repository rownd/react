import { useEffect } from 'react';
import { HubListenerProps } from '../RowndProvider';

declare global {
  interface Window {
    _rphConfig: any;
  }
}

function setConfigValue(key: string, value: any) {
  if (!value) {
    return;
  }

  window?._rphConfig.push([key, value]);
}

export type HubScriptInjectorProps = {
  appKey: string;
  stateListener: ({ state, api }: HubListenerProps) => void;
  hubUrlOverride?: string;
  locationHash?: string;
};

// Grab the URL hash ASAP in case it contains an `rph_init` param
const locationHash =
  typeof window !== 'undefined' ? window?.location?.hash : void 0;

export default function HubScriptInjector({
  appKey,
  hubUrlOverride,
  stateListener,
  ...rest
}: HubScriptInjectorProps) {

  useEffect(() => {
    if (!window) {
      return; // compat with server-side rendering
    }

    const _rphConfig = (window._rphConfig = window._rphConfig || []);
    const baseUrl =
      window.localStorage.getItem('rph_base_url_override') ||
      hubUrlOverride ||
      'https://hub.rownd.io';
    _rphConfig.push(['setBaseUrl', baseUrl]);
    const d = document,
      g = d.createElement('script'),
      m = d.createElement('script'),
      s = d.getElementsByTagName('script')[0];
    g.noModule = true;
    g.async = true;
    g.src = baseUrl + '/static/scripts/rph.js';
    m.type = 'module';
    m.async = true;
    m.src = baseUrl + '/static/scripts/rph.mjs';

    if (s?.parentNode) {
      s.parentNode.insertBefore(g, s);
      s.parentNode.insertBefore(m, s);
    } else {
      d.body.appendChild(g);
      d.body.appendChild(m);
    }

    setConfigValue('setAppKey', appKey);
    setConfigValue('setStateListener', stateListener);
    setConfigValue('setLocationHash', locationHash);

    if (window.localStorage.getItem('rph_log_level') === 'debug') {
      console.debug('[debug] rest:', rest);
    }

    if (rest) {
      Object.entries(rest).forEach(([key, value]) => {
        setConfigValue(
          `set${key.charAt(0).toUpperCase() + key.substring(1)}`,
          value
        );
      });

      if (window.localStorage.getItem('rph_log_level') === 'debug') {
        console.debug('[debug] hubConfig:', window._rphConfig);
      }
    }
  }, [appKey, stateListener, locationHash, hubUrlOverride, rest]);

  return null;
}
