import { getRowndAuthenticationStatus } from './token';

type LoaderFunctionArgs = {
  request: Record<string, any>;
  context: Record<string, any>;
} & any;

type RowndLoaderResponse = {
  access_token: string;
  is_authenticated: true;
  user_id: string;
};

export const withRowndLoader = (
  loader: (args: LoaderFunctionArgs, rowndResponse: RowndLoaderResponse) => Promise<any>,
  options: {
    onUnauthenticated?: (args: LoaderFunctionArgs) => void;
  } = {}
) => {
  return async function (args: LoaderFunctionArgs) {
    const { request } = args;
    const status = await getRowndAuthenticationStatus(
      request.headers.get('Cookie')
    );

    if (!status.is_authenticated) {
      const onUnauthenticatedCallback = options?.onUnauthenticated;
      if (onUnauthenticatedCallback) {
        return onUnauthenticatedCallback(args);
      }
      return { is_authenticated: false };
    }
    return loader(args, {
      ...status,
    });
  };
};