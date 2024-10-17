export type RowndCookieData = {
  accessToken: string;
};

const createCookie = (id: string) => {
  return {
    parse: (header: string | null): undefined | RowndCookieData => {
      if (!header) return undefined;
      const cookies = header.split(';');

      for (const cookie of cookies) {
        const [name, value] = cookie.split('=');

        if (decodeURIComponent(name.trim()) === id) {
          try {
            const parsedValue = JSON.parse(decodeURIComponent(value.trim()));
            return parsedValue;
          } catch (err) {
            console.error('Failed to parse cookie', err);
            return undefined;
          }
        }
      }

      return undefined;
    },
    serialize: (data: RowndCookieData): string => {
      let cookie = `${encodeURIComponent(id)}=${encodeURIComponent(
        JSON.stringify(data)
      )}`;

      cookie += '; Secure';
      cookie += '; HttpOnly';
      cookie += '; Max-Age=3600'; // 1 hour
      cookie += '; SameSite=Strict'

      return cookie;
    },
  };
};

export const ROWND_TOKEN_CALLBACK_PATH = '/rownd-token-callback';

export const setCookie = async (token: string): Promise<string | undefined> => {
  try {
    await fetch(ROWND_TOKEN_CALLBACK_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken: token }),
    });
    return token;
  } catch (err) {
    console.error('Failed to set cookie: ', err);
    return undefined; 
  }
};

export const rowndCookie = createCookie('rownd-session');
