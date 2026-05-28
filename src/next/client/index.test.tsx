import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Client from './index';
import { useRownd } from './useRownd';
import useCookie from '../../ssr/hooks/useCookie';
import { syncUserToSuperTokens } from '../../utils/supertokens-sync';

vi.mock('../../hooks/useHub', () => ({
  default: () => ({
    setInitialHubState: vi.fn(() => ({})),
    hubListenerCb: vi.fn(),
  }),
}));

vi.mock('../../ssr/hooks/useCookie');
vi.mock('./useRownd');
vi.mock('../../context/HubScriptInjector/HubScriptInjector', () => ({
  default: () => null,
}));
vi.mock('../../utils/supertokens-sync', async () => {
  const actual = await vi.importActual<typeof import('../../utils/supertokens-sync')>(
    '../../utils/supertokens-sync'
  );

  return {
    ...actual,
    syncUserToSuperTokens: vi.fn(() => Promise.resolve()),
  };
});

describe('Next Client', () => {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCookie).mockReturnValue({
      cookieSignIn: vi.fn(() => Promise.resolve()),
      cookieSignOut: vi.fn(),
    });

    vi.mocked(useRownd).mockReturnValue({
      access_token: 'rownd-access-token',
      events: {
        addEventListener,
        removeEventListener,
      },
      is_authenticated: false,
      is_initializing: true,
      user: { data: {} },
    } as unknown as ReturnType<typeof useRownd>);
  });

  it('syncs new Rownd users to SuperTokens on sign-in completion', async () => {
    render(
      <Client
        appKey="app-key"
        supertokens={{
          appInfo: {
            appName: 'test-app',
            apiDomain: 'https://api.example.com/',
            apiBasePath: '/auth/',
          },
        }}
      />
    );

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith(
        'sign_in_completed',
        expect.any(Function)
      );
    });

    const handler = addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'sign_in_completed'
    )?.[1] as EventListener;

    await act(async () => {
      handler(
        new CustomEvent('sign_in_completed', {
          detail: { user_type: 'new_user' },
        })
      );
    });

    expect(syncUserToSuperTokens).toHaveBeenCalledWith(
      'rownd-access-token',
      {
        appName: 'test-app',
        apiDomain: 'https://api.example.com',
        apiBasePath: '/auth',
      }
    );
  });

  it('does not sync existing users to SuperTokens', async () => {
    render(
      <Client
        appKey="app-key"
        supertokens={{
          appInfo: {
            appName: 'test-app',
            apiDomain: 'https://api.example.com',
            apiBasePath: '/auth',
          },
        }}
      />
    );

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith(
        'sign_in_completed',
        expect.any(Function)
      );
    });

    const handler = addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'sign_in_completed'
    )?.[1] as EventListener;

    await act(async () => {
      handler(
        new CustomEvent('sign_in_completed', {
          detail: { user_type: 'existing_user' },
        })
      );
    });

    expect(syncUserToSuperTokens).not.toHaveBeenCalled();
  });
});
