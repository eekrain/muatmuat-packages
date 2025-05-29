"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4 text-lg">Page not found</p>
        <Link
          href="/sewaarmada"
          className="mt-8 rounded-md bg-muat-trans-primary-400 px-4 py-2 text-white hover:bg-muat-trans-primary-500"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
