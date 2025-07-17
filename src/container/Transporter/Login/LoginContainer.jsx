const LoginContainer = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <svg
          className="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 3.95-.236.478-.497 1.01-.787 1.64M11.42 15.17L2.82 6.62"
          />
        </svg>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Under Development
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          This page is currently being built.
        </p>
        <p className="mt-1 text-sm text-gray-500">Please check back later.</p>
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
