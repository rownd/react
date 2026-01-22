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
  let mockReload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock window.location.reload
    mockReload = vi.fn();
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

  describe('initial load (first render after initialization)', () => {
    it('should sync cookie without reload when token exists on initial load', () => {
      (useRownd as any).mockReturnValue({
        access_token: 'existing-token',
        is_initializing: false
      });

      render(<RowndServerStateSync />);

      // Should sync cookie
      expect(mockCookieSignIn).toHaveBeenCalledTimes(1);
      // Should NOT pass a reload callback - just sync silently
      expect(mockCookieSignIn).toHaveBeenCalledWith();
      expect(mockCookieSignOut).not.toHaveBeenCalled();
    });

    it('should not trigger any actions when no token on initial load', () => {
      (useRownd as any).mockReturnValue({
        access_token: null,
        is_initializing: false
      });

      render(<RowndServerStateSync />);

      // No token on initial load means user wasn't signed in - nothing to sync
      expect(mockCookieSignIn).not.toHaveBeenCalled();
      expect(mockCookieSignOut).not.toHaveBeenCalled();
    });
  });

  describe('sign-in (null -> token)', () => {
    it('should trigger cookieSignIn with reload callback when signing in', () => {
      const mockUseRownd = useRownd as any;

      // Initial render with no token
      mockUseRownd.mockReturnValue({
        access_token: null,
        is_initializing: false
      });

      const { rerender } = render(<RowndServerStateSync />);
      vi.clearAllMocks();

      // User signs in - token becomes available
      mockUseRownd.mockReturnValue({
        access_token: 'new-token',
        is_initializing: false
      });

      rerender(<RowndServerStateSync />);

      expect(mockCookieSignIn).toHaveBeenCalledTimes(1);
      // Should pass a reload callback for sign-in
      expect(mockCookieSignIn).toHaveBeenCalledWith(expect.any(Function));
      expect(mockCookieSignOut).not.toHaveBeenCalled();
    });
  });

  describe('token refresh (token -> different token)', () => {
    it('should sync cookie silently without reload on token refresh', () => {
      const mockUseRownd = useRownd as any;

      // Initial render with a token
      mockUseRownd.mockReturnValue({
        access_token: 'original-token',
        is_initializing: false
      });

      const { rerender } = render(<RowndServerStateSync />);
      vi.clearAllMocks();

      // Token refreshes - different token
      mockUseRownd.mockReturnValue({
        access_token: 'refreshed-token',
        is_initializing: false
      });

      rerender(<RowndServerStateSync />);

      // Should sync cookie silently (no reload callback)
      expect(mockCookieSignIn).toHaveBeenCalledTimes(1);
      expect(mockCookieSignIn).toHaveBeenCalledWith();
      expect(mockCookieSignOut).not.toHaveBeenCalled();
    });
  });

  describe('sign-out (token -> null)', () => {
    it('should trigger cookieSignOut with reload callback when signing out', () => {
      const mockUseRownd = useRownd as any;

      // Initial render with a token
      mockUseRownd.mockReturnValue({
        access_token: 'existing-token',
        is_initializing: false
      });

      const { rerender } = render(<RowndServerStateSync />);
      vi.clearAllMocks();

      // User signs out - token removed
      mockUseRownd.mockReturnValue({
        access_token: null,
        is_initializing: false
      });

      rerender(<RowndServerStateSync />);

      expect(mockCookieSignOut).toHaveBeenCalledTimes(1);
      // Should pass a reload callback for sign-out
      expect(mockCookieSignOut).toHaveBeenCalledWith(expect.any(Function));
      expect(mockCookieSignIn).not.toHaveBeenCalled();
    });
  });

  describe('no change (same token)', () => {
    it('should not trigger any cookie actions when access token remains the same', () => {
      const mockUseRownd = useRownd as any;

      // Initial render with a token
      mockUseRownd.mockReturnValue({
        access_token: 'same-token',
        is_initializing: false
      });

      const { rerender } = render(<RowndServerStateSync />);
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
});
