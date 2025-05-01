import { RowndProviderProps } from "../context/RowndContext";

// Convex does not export this type, so we need to define it ourselves
export type AuthTokenFetcher = (args: {
  forceRefreshToken: boolean;
}) => Promise<string | null | undefined>;

// Another type that Convex does not export, so we need to define it ourselves
export type IConvexReactClient = {
  setAuth(fetchToken: AuthTokenFetcher): void;
  clearAuth(): void;
};

export type ConvexRowndProviderProps = RowndProviderProps & {
  client: IConvexReactClient;
}
