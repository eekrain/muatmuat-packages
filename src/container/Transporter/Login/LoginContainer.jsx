const LoginContainer = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url("/img/background-indonesia-map.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center">
        <img src="/img/sewa-armada-first-timer-apps.png" alt="dev" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Under Development
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          This page is currently being built.
        </p>
        <p className="mt-1 text-sm text-gray-500">Please check back later.</p>
      </div>
    </div>
  );
};

export default LoginContainer;
