// import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

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

type HubScriptInjectorProps = {
  appKey: string;
  stateListener: Function;
  hubUrlOverride?: string;
  locationHash?: string;
};

export default function HubScriptInjector({
  appKey,
  hubUrlOverride,
  stateListener,
  locationHash,
  ...rest
}: HubScriptInjectorProps) {
  useEffect(() => {
    if (!window) {
      return; // compat with server-side rendering
    }

    var _rphConfig = (window._rphConfig = window._rphConfig || []);
    let baseUrl =
      window.localStorage.getItem('rph_base_url_override') ||
      hubUrlOverride ||
      'https://hub.rownd.io';
    _rphConfig.push(['setBaseUrl', baseUrl]);
    var d = document,
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

    console.log('rest:', rest);

    if (rest) {
      Object.entries(rest).forEach(([key, value]) => {
        setConfigValue(
          `set${key.charAt(0).toUpperCase() + key.substring(1)}`,
          value
        );
      });
      console.log('hubConfig:', window._rphConfig);
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
