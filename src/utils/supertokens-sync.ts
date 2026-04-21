export async function syncUserToSuperTokens(
  accessToken: string,
  appInfo: { appName: string; apiDomain: string; apiBasePath: string }
): Promise<void> {
  const base = `${appInfo.apiDomain}${appInfo.apiBasePath}`;
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    const res = await fetch(`${base}/plugin/rownd/migrate`, {
      method: 'POST',
      headers,
      credentials: 'include',
    });
    if (!res.ok) {
      console.warn(`[Rownd->ST] migrate failed with status: ${res.status}`);
    }
    console.log('[Rownd->ST] migrate success');
  } catch (e) {
    console.warn('[Rownd->ST] migrate failed (non-fatal):', e);
  }
}
