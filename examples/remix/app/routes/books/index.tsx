import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import {
  getRowndAuthenticationStatus,
  useRownd,
  withRowndRequireSignIn,
} from '../../../../../src/remix';

type LoaderResponse = {
  userId: string;
  accessToken: string;
  posts: {
    userId: number;
    id: number;
    title: string;
    body: string;
  }[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderResponse | { authenticated: boolean }> => {
  const { accessToken, authenticated, userId } =
    await getRowndAuthenticationStatus(request.headers.get('Cookie'));
  if (!authenticated) {
    return { authenticated };
  }

  const postsRes = await fetch(
    'https://jsonplaceholder.typicode.com/posts',
  );
  const posts = await postsRes.json();

  return { userId, accessToken, posts };
};

function Index() {
  const navigate = useNavigate();
  const { is_authenticated, user, requestSignIn, signOut } = useRownd();
  const { posts } = useLoaderData<LoaderResponse>();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            My books
          </h1>
          <div className='flex flex-col gap-1'>
          {posts.filter((_, idx) => idx < 5).map((post) => (
            <div className='flex flex-col p-2' key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          ))}
          </div>
          {is_authenticated && <h1>User: {user.data.user_id}</h1>}
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            onClick={() => (is_authenticated ? signOut() : requestSignIn())}
          >
            {is_authenticated ? 'Sign out' : 'Sign in'}
          </button>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600' onClick={() => navigate('/profile')}>Link to profile</button>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600' onClick={() => navigate('/')}>Link to home</button>
        </header>
      </div>
    </div>
  );
}

export default withRowndRequireSignIn(Index, useLoaderData);
