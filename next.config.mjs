/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        hostname: "cdn.builder.io",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

// export default MillionLint.next({
//   enabled: process.env.NODE_ENV === "development",
//   rsc: process.env.NODE_ENV === "development",
// })(nextConfig);
