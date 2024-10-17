import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import {
  getRowndAuthenticationStatus,
  useRownd,
  withRowndAuthenticated,
} from '../../../../../src/remix';

type LoaderResponse = {
  userId: string;
  accessToken: string;
  profile: Record<string, any>;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderResponse | { authenticated: boolean }> => {
  const { accessToken, authenticated, userId } =
    await getRowndAuthenticationStatus(request.headers.get('Cookie'));
  if (!authenticated) {
    return { authenticated };
  }

  const profileRes = await fetch(
    'https://api.rownd.io/me/applications/406650865825350227/data',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const profile = await profileRes.json();

  return { userId, accessToken, profile };
};

function Index() {
  const navigate = useNavigate();
  const { is_authenticated, user, requestSignIn, signOut } = useRownd();
  const { userId, accessToken, profile } = useLoaderData<LoaderResponse>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            My profile
          </h1>
          <ul className='pl-32 list-disc'>
            {Object.entries(profile).map(([key, value]) => (
              <li key={key}>
                {key}: {JSON.stringify(value)}
              </li>
            ))}
          </ul>
          {is_authenticated && <h1>User: {user.data.user_id}</h1>}
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            onClick={() => (is_authenticated ? signOut() : requestSignIn())}
          >
            {is_authenticated ? 'Sign out' : 'Sign in'}
          </button>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600' onClick={() => navigate('/books')}>Link to books</button>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600' onClick={() => navigate('/')}>Link to home</button>
        </header>
      </div>
    </div>
  );
}

export default withRowndAuthenticated(Index, useLoaderData);
