import { useEffect, useRef } from 'react';
import { RowndProviderProps } from '../context/RowndContext';
import { TRowndContext } from '../context/types';
import {
  normalizeSuperTokensAppInfo,
  syncUserToSuperTokens,
} from '../utils/supertokens-sync';

type UseSuperTokensMigrationProps = {
  accessToken: string | null;
  events: TRowndContext['events'];
  supertokens?: RowndProviderProps['supertokens'];
};

function isNewUserSignInCompletedEvent(event: Event): boolean {
  if (typeof CustomEvent === 'undefined' || !(event instanceof CustomEvent)) {
    return false;
  }

  const detail = event.detail;
  if (!detail || typeof detail !== 'object') {
    return false;
  }

  return (detail as { user_type?: unknown }).user_type === 'new_user';
}

export function useSuperTokensMigration({
  accessToken,
  events,
  supertokens,
}: UseSuperTokensMigrationProps): void {
  const appInfo = supertokens?.appInfo;
  const accessTokenRef = useRef<string | null>(accessToken);
  const supertokensAppInfoRef = useRef(
    normalizeSuperTokensAppInfo(appInfo)
  );

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    supertokensAppInfoRef.current = normalizeSuperTokensAppInfo(
      appInfo
    );
  }, [appInfo?.appName, appInfo?.apiDomain, appInfo?.apiBasePath]);

  useEffect(() => {
    const handleSignInCompleted = (event: Event) => {
      if (!isNewUserSignInCompletedEvent(event)) {
        return;
      }

      const currentAccessToken = accessTokenRef.current;
      const appInfo = supertokensAppInfoRef.current;
      if (!currentAccessToken || !appInfo) {
        return;
      }

      void syncUserToSuperTokens(currentAccessToken, appInfo);
    };

    events.addEventListener('sign_in_completed', handleSignInCompleted);

    return () => {
      events.removeEventListener('sign_in_completed', handleSignInCompleted);
    };
  }, [events]);
}
