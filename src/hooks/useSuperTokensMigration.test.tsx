import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSuperTokensMigration } from './useSuperTokensMigration';
import { syncUserToSuperTokens } from '../utils/supertokens-sync';
import { TRowndContext } from '../context/types';

vi.mock('../utils/supertokens-sync', async () => {
  const actual = await vi.importActual<
    typeof import('../utils/supertokens-sync')
  >('../utils/supertokens-sync');

  return {
    ...actual,
    syncUserToSuperTokens: vi.fn(() => Promise.resolve()),
  };
});

describe('useSuperTokensMigration', () => {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();
  const events = {
    addEventListener,
    removeEventListener,
  } as unknown as TRowndContext['events'];

  function TestComponent() {
    useSuperTokensMigration({
      accessToken: 'rownd-access-token',
      events,
      supertokens: {
        appInfo: {
          appName: 'test-app',
          apiDomain: 'https://api.example.com/',
          apiBasePath: '/auth/',
        },
      },
    });

    return null;
  }

  function getSignInCompletedHandler(): EventListener {
    return addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'sign_in_completed'
    )?.[1] as EventListener;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('syncs new Rownd users to SuperTokens', async () => {
    render(<TestComponent />);

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith(
        'sign_in_completed',
        expect.any(Function)
      );
    });

    await act(async () => {
      getSignInCompletedHandler()(new CustomEvent('sign_in_completed', {
        detail: { user_type: 'new_user' },
      }));
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

  it('ignores non-CustomEvent sign-in events', async () => {
    render(<TestComponent />);

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith(
        'sign_in_completed',
        expect.any(Function)
      );
    });

    await act(async () => {
      getSignInCompletedHandler()(new Event('sign_in_completed'));
    });

    expect(syncUserToSuperTokens).not.toHaveBeenCalled();
  });

  it('ignores CustomEvent details without a new user type', async () => {
    render(<TestComponent />);

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith(
        'sign_in_completed',
        expect.any(Function)
      );
    });

    await act(async () => {
      getSignInCompletedHandler()(new CustomEvent('sign_in_completed', {
        detail: { user_type: 'existing_user' },
      }));
      getSignInCompletedHandler()(new CustomEvent('sign_in_completed', {
        detail: 'new_user',
      }));
      getSignInCompletedHandler()(new CustomEvent('sign_in_completed', {
        detail: null,
      }));
    });

    expect(syncUserToSuperTokens).not.toHaveBeenCalled();
  });
});
