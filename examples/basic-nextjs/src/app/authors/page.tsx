import Fallback from '@/components/Fallback';
import withRowndAuth from '../../../../../src/next/server/withRowndAuth';
import Link from 'next/link';
import { getRowndUser } from '../../../../../src/next/server/getRowndUser';

const Authors = async () => {
  let data = await fetch('https://jsonplaceholder.typicode.com/posts');
  let posts: { id: number; title: string; body: string }[] = await data.json();

  const user = await getRowndUser();

  return (
    <div className="flex justify-center flex-col w-50 ">
      <h1 className="text-2xl font-bold">Authors</h1>
      <h3>User ID: {user?.user_id}</h3>
      <Link className="text-underline text-sm text-gray-100 hover:text-gray-200" prefetch={true} href="/">
        Take me home
      </Link>
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

export default withRowndAuth(Authors, Fallback, {
  onUnauthenticated: () => {
    console.log('Unauthenticated');
  },
});
