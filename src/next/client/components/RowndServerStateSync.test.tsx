import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRownd } from '../useRownd';
import useCookie from '../../../ssr/hooks/useCookie';
import RowndServerStateSync from './RowndServerStateSync';

// Mock the hooks
vi.mock('../useRownd');
vi.mock('../../../ssr/hooks/useCookie');

describe('RowndServerStateSync', () => {
  const mockCookieSignIn = vi.fn();
  const mockCookieSignOut = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    // Setup default mock implementations
    (useCookie as any).mockReturnValue({
      cookieSignIn: mockCookieSignIn,
      cookieSignOut: mockCookieSignOut
    });
  });

  it('should not trigger cookie actions when initializing', () => {
    (useRownd as any).mockReturnValue({
      access_token: 'test-token',
      is_initializing: true
    });

    render(<RowndServerStateSync />);

    expect(mockCookieSignIn).not.toHaveBeenCalled();
    expect(mockCookieSignOut).not.toHaveBeenCalled();
  });

  it('should trigger cookieSignIn when access token becomes available', () => {
    (useRownd as any).mockReturnValue({
      access_token: 'new-token',
      is_initializing: false
    });

    render(<RowndServerStateSync />);

    expect(mockCookieSignIn).toHaveBeenCalled();
    expect(mockCookieSignOut).not.toHaveBeenCalled();
  });

  it('should trigger cookieSignOut when access token is removed', () => {
    (useRownd as any).mockReturnValue({
      access_token: null,
      is_initializing: false
    });

    render(<RowndServerStateSync />);

    expect(mockCookieSignOut).toHaveBeenCalled();
    expect(mockCookieSignIn).not.toHaveBeenCalled();
  });

  it('should not trigger any cookie actions when access token remains the same', () => {
    const mockUseRownd = useRownd as any;

    // Initial render with a token
    mockUseRownd.mockReturnValue({
      access_token: 'same-token',
      is_initializing: false
    });

    const { rerender } = render(<RowndServerStateSync />);

    // Clear the mock calls from initial render
    vi.clearAllMocks();

    // Rerender with the same token
    mockUseRownd.mockReturnValue({
      access_token: 'same-token',
      is_initializing: false
    });

    rerender(<RowndServerStateSync />);

    expect(mockCookieSignIn).not.toHaveBeenCalled();
    expect(mockCookieSignOut).not.toHaveBeenCalled();
  });
});
