import Fallback from '@/components/Fallback';
// import { getRowndUser } from '@rownd/next/server';
// import { withRowndRequireSignIn } from '@rownd/next';
import { getRowndUser } from '../../../../../src/next/server';
import { withRowndRequireSignIn } from '../../../../../src/next';
import { cookies } from 'next/headers';

async function Authors() {
  const data = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts: { id: number; title: string; body: string }[] = await data.json();
  const user = await getRowndUser(cookies);

  return (
    <div className="flex justify-center flex-col w-50 ">
      <h1 className="text-2xl font-bold">Authors</h1>
      <h3>User ID: {JSON.stringify(user, null, 2)}</h3>
      <Fallback />
      <ul className="flex flex-col list-disc">
      {posts
        .filter((_, idx) => idx < 5)
        .map((post) => (
          <li className="flex flex-col p-2" key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withRowndRequireSignIn(Authors, cookies, Fallback, {
  onUnauthenticated: () => {
    // Handle unauthenticated flow
  },
});
