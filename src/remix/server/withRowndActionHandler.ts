import { ROWND_TOKEN_CALLBACK_PATH, rowndCookie } from "./cookie";

export function withRowndHandleRequest(
  handleRequest: (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: any,
    loadContext: any
  ) => Promise<unknown>
) {
  return async function (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: any,
    loadContext: any
  ) {
    const url = new URL(request.url);
    if (url.pathname === ROWND_TOKEN_CALLBACK_PATH) {
      return handleRowndTokenCallback(request);
    }

    return handleRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
      loadContext
    );
  };
}

async function handleRowndTokenCallback(request: Request) {
  const body = request.body;
  try {
    const text = await new Response(body).text();
    const res = JSON.parse(text);

    const accessToken = res?.accessToken;
    if (!accessToken) {
      throw new Error('Missing access token');
    }

    return new Response('Success', {
      headers: {
        'Set-Cookie': rowndCookie.serialize({
          accessToken,
        }),
      },
    });
  } catch (err) {
    console.error('Failed to decode body text', err);
    return 'Failed';
  }
}
