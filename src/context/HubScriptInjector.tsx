// import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { HubListenerProps } from './RowndProvider';
import { TargetWindow } from './types';

declare global {
  interface Window {
    _rphConfig: any;
    rownd: any;
  }
}

function setConfigValue(targetWindow: TargetWindow, key: string, value: any) {
  if (!value) {
    return;
  }

  targetWindow?._rphConfig.push([key, value]);
}

type HubScriptInjectorProps = {
  appKey: string;
  stateListener: ({ state, api }: HubListenerProps) => void;
  useIframeParent?: boolean;
  hubUrlOverride?: string;
  locationHash?: string;
};

export default function HubScriptInjector({
  appKey,
  useIframeParent,
  hubUrlOverride,
  stateListener,
  locationHash,
  ...rest
}: HubScriptInjectorProps) {
  useEffect(() => {
    if (!window) {
      return; // compat with server-side rendering
    }

    let targetWindow: typeof window.parent | typeof window = window;
    if (useIframeParent) {
      targetWindow = window.parent;
      window._rphConfig = targetWindow._rphConfig;
    } else if (!targetWindow._rphConfig && !targetWindow.rownd) {
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

      setConfigValue(targetWindow, 'setAppKey', appKey);
      setConfigValue(targetWindow, 'setLocationHash', locationHash);
    }

    setConfigValue(targetWindow, 'setStateListener', stateListener);

    if (targetWindow.localStorage.getItem('rph_log_level') === 'debug') {
      console.debug('[debug] rest:', rest);
    }

    if (rest) {
      Object.entries(rest).forEach(([key, value]) => {
        setConfigValue(
          targetWindow,
          `set${key.charAt(0).toUpperCase() + key.substring(1)}`,
          value
        );
      });

      if (targetWindow.localStorage.getItem('rph_log_level') === 'debug') {
        console.debug('[debug] hubConfig:', window._rphConfig);
      }
    }
  }, [appKey, stateListener, locationHash, hubUrlOverride, rest]);

  return null;
}

HubScriptInjector.propTypes = {
  appKey: PropTypes.string.isRequired,
  postLoginRedirect: PropTypes.string,
  rootOrigin: PropTypes.string,
  apiUrl: PropTypes.string,
  externalComponent: PropTypes.object,
};
