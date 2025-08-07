/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        hostname: "cdn.builder.io",
      },
      {
        hostname: "azlogistik.s3.ap-southeast-3.amazonaws.com",
      },
      {
        hostname: "fastly.picsum.photos",
      },
      {
        hostname: "picsum.photos",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

// import MillionLint from "@million/lint";
// export default MillionLint.next({
//   enabled: process.env.NODE_ENV === "development",
//   rsc: process.env.NODE_ENV === "development",
// })(nextConfig);
