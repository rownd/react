// import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

declare global {
    interface Window {
        _rphConfig:any;
    }
}

function setConfigValue(key: string, value: any) {
    if (!value) {
        return;
    }

    window._rphConfig.push([key, value]);
}

type HubScriptInjectorProps = {
    appKey: string;
    rootOrigin?: string;
    apiUrl?: string;
    postLoginRedirect?: string;
    stateListener: Function;
    hubUrlOverride?: string;
}

export default function HubScriptInjector(props: HubScriptInjectorProps) {
    let { appKey, rootOrigin, apiUrl, postLoginRedirect, stateListener } = props;
    useEffect(() => {
        var _rphConfig = (window._rphConfig =
            window._rphConfig || []);
        let baseUrl = window.localStorage.getItem('rph_base_url_override') || props.hubUrlOverride || 'https://hub.rownd.io';
        _rphConfig.push(['setBaseUrl', baseUrl]);
        var d = document,
            g = d.createElement('script'),
            s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.async = true;
        g.src = baseUrl + '/static/scripts/rph.js';

        if (s?.parentNode) {
            s.parentNode.insertBefore(g, s);
        } else {
            d.body.appendChild(g);
        }
    
        setConfigValue('setApiUrl', apiUrl);
        setConfigValue('setAppKey', appKey);
        setConfigValue('setPostLoginRedirect', postLoginRedirect);
        setConfigValue('setRootOrigin', rootOrigin);
        setConfigValue('setStateListener', stateListener);
    }, [apiUrl, appKey, postLoginRedirect, rootOrigin, stateListener]);

    return null;
}

HubScriptInjector.propTypes = {
    appKey: PropTypes.string.isRequired,
    postLoginRedirect: PropTypes.string,
    rootOrigin: PropTypes.string,
    apiUrl: PropTypes.string,
    externalComponent: PropTypes.object,
};
