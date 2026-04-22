type SuperTokensAppInfo = {
  appName: string;
  apiDomain: string;
  apiBasePath: string;
};

export function normalizeSuperTokensAppInfo(
  appInfo?: SuperTokensAppInfo
): SuperTokensAppInfo | undefined {
  if (!appInfo) {
    return undefined;
  }

  const apiDomain = appInfo.apiDomain.replace(/\/+$/, '');
  const trimmedBasePath = appInfo.apiBasePath.trim().replace(/^\/+|\/+$/g, '');

  return {
    ...appInfo,
    apiDomain,
    apiBasePath: trimmedBasePath ? `/${trimmedBasePath}` : '',
  };
}

export async function syncUserToSuperTokens(
  accessToken: string,
  appInfo: SuperTokensAppInfo
): Promise<void> {
  const migrateUrl = new URL(
    `${appInfo.apiBasePath}/plugin/rownd/migrate`,
    `${appInfo.apiDomain}/`
  );
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    const res = await fetch(migrateUrl.toString(), {
      method: 'POST',
      headers,
      credentials: 'include',
    });
    if (!res.ok) {
      console.warn(`[Rownd->ST] migrate failed with status: ${res.status}`);
    }
  } catch (e) {
    console.warn('[Rownd->ST] migrate failed (non-fatal):', e);
  }
}
