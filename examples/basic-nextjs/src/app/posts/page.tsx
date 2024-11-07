// import { cookies } from 'next/headers';
// import { RequireSignIn } from '../../../../../src';

// type WithAuthProps = {
//   children: React.ReactNode;
// };

// const withAuth = async (
//   WrappedComponent: React.ComponentType<RowndAuthProps & WithAuthProps>,
//   LoadingComponent: React.ComponentType
// ) => {
//   return async function AuthenticatedComponent(props: WithAuthProps) {
//     const cookieStore = cookies();
//     const authCookie = cookieStore.get('auth-token');

//     if (!authCookie) {
//       console.log('no auth cookie');
//       return (
//         <RequireSignIn>
//           <LoadingComponent />
//         </RequireSignIn>
//       );
//     }

//     let data = await fetch('https://jsonplaceholder.typicode.com/posts');
//     let posts: { id: number; title: string; body: string }[] =
//       await data.json();

//     return (
//       <WrappedComponent {...props} accessToken="AccessToken" userId="UserId" />
//     );
//   };
// };

export default async function Posts() {
  let data = await fetch('https://jsonplaceholder.typicode.com/posts');
  let posts: { id: number; title: string; body: string }[] = await data.json();

  return (
    <div className="flex justify-center flex-col w-50 ">
      <h1>Posts</h1>
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
};

//export default withAuth(Posts, () => <div>Loading...</div>);
