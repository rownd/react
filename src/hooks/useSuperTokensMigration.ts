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
  const accessTokenRef = useRef<string | null>(accessToken);
  const supertokensAppInfoRef = useRef(
    normalizeSuperTokensAppInfo(supertokens?.appInfo)
  );

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    supertokensAppInfoRef.current = normalizeSuperTokensAppInfo(
      supertokens?.appInfo
    );
  }, [supertokens]);

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
