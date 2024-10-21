import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import {
  getRowndAuthenticationStatus,
  useRownd,
  withRowndRequireSignIn,
} from '../../../../../src/remix';

type LoaderResponse = {
  user_id: string;
  access_token: string;
  profile: Record<string, any>;
};

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderResponse | { is_authenticated: boolean }> => {
  const { access_token, is_authenticated, user_id } =
    await getRowndAuthenticationStatus(request.headers.get('Cookie'));
  
  if (!is_authenticated) {
    return { is_authenticated };
  }

  const profileRes = await fetch(
    `${process.env.ROWND_API_URL}/me/applications/395599692981862989/data`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const profile = await profileRes.json();

  return { user_id, access_token, profile };
};

function Index() {
  const navigate = useNavigate();
  const { is_authenticated, user, requestSignIn, signOut } = useRownd();
  const { profile } = useLoaderData<LoaderResponse>();

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

export default withRowndRequireSignIn(Index, useLoaderData);
