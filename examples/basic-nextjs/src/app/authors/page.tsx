import Fallback from '@/components/Fallback';
import withRowndAuth from '../../../../../src/next/server/withRowndAuth';
import Link from 'next/link';
import { RowndAuthenticatedUser } from '../../../../../src/ssr/server/token';

const Authors = async (props: { rowndUser: RowndAuthenticatedUser }) => {
  let data = await fetch('https://jsonplaceholder.typicode.com/posts');
  let posts: { id: number; title: string; body: string }[] = await data.json();

  const user = props.rowndUser;

  console.log('user', user);

  return (
    <div className="flex justify-center flex-col w-50 ">
      <h1>Authors</h1>
      <h3>User ID: {user.user_id}</h3>
      <Link className="text-underline" prefetch={true} href="/">
        Home
      </Link>
      <Fallback />
      {posts
        .filter((_, idx) => idx < 5)
        .map((post) => (
          <div className="flex flex-col p-2" key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
    </div>
  );
}

export default withRowndAuth(Authors, Fallback, {
  onUnauthenticated: () => {
    console.log('Unauthenticated');
  },
});
