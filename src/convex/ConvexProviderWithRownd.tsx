import React from "react";

import { ReactNode, useCallback, useMemo } from "react";
import type { IConvexReactClient } from "./types";
import { ConvexProviderWithAuth } from "convex/react";
import { useRownd } from "../context";

type UseRownd = typeof useRownd;

export function ConvexProviderWithRownd({
  children,
  client,
  useRownd
}: {
  children: ReactNode;
  client: IConvexReactClient;
  useRownd: UseRownd;
}) {
  const useRowndFromRownd = useUseRowndFromRownd(useRownd);
  return (
    <ConvexProviderWithAuth client={client} useAuth={useRowndFromRownd}>
      {children}
    </ConvexProviderWithAuth>
  );
}

function useUseRowndFromRownd(useRownd: UseRownd) {
  return useMemo(
    () =>
      function useRowndFromRownd() {
        const { is_initializing, is_authenticated, getAccessToken } = useRownd();
        const fetchAccessToken = useCallback(
          async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
            try {
              return (await getAccessToken({
                waitForToken: true,
                template: "convex",
                forceRefresh: forceRefreshToken,
              })) ?? null;
            } catch {
              return null;
            }
          },
          // Build a new fetchAccessToken to trigger setAuth() whenever these change.
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [],
        );
        return useMemo(
          () => ({
            isLoading: is_initializing,
            isAuthenticated: is_authenticated,
            fetchAccessToken,
          }),
          [is_initializing, is_authenticated, fetchAccessToken],
        );
      },
    [useRownd],
  );
}
