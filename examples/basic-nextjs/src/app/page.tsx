import Link from 'next/link';

export default function Home() {

  return (
    <div className="flex justify-center flex-col w-50 ">
      <h1 className="text-2xl font-bold">Home</h1>
      <Link className="text-underline text-sm text-gray-100 hover:text-gray-200" href="/authors">
        Go to authors page
      </Link>
    </div>
  );
}
