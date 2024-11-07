'use client';

import Link from 'next/link';

export default function Home() {

  return (
    <div className="flex justify-center flex-col w-50 ">
      <h1>Home</h1>
      <Link href="/authors">Authors</Link>
    </div>
  );
}
