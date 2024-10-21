import { getRowndAuthenticationStatus } from './token';

type LoaderFunctionArgs = {
  request: Record<string, any>;
  context: Record<string, any>;
} & any;

type RowndLoaderResponse =
  | {
      access_token: string;
      is_authenticated: true;
      user_id: string;
    }
  | {
      access_token: undefined;
      is_authenticated: false;
      user_id: undefined;
    };

export const withRowndLoader = (
  loader: (args: LoaderFunctionArgs, rowndResponse: RowndLoaderResponse) => Promise<any>
) => {
  return async function (args: LoaderFunctionArgs) {
    const { request } = args;
    const status = await getRowndAuthenticationStatus(
      request.headers.get('Cookie')
    );

    if (!status.is_authenticated) {
      return { is_authenticated: false };
    }
    return loader(args, {
      ...status,
    });
  };
};
