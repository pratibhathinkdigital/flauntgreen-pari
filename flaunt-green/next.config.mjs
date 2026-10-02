/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove "output: export" — it prevents server-side features (searchParams, API calls, Script strategy)
  trailingSlash: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // Production API server — update hostname to match your actual domain
        protocol: "https",
        hostname: "api.flauntgreen.in",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "flauntgreen.in",
        pathname: "/storage/**",
      },
    ],
  },

  reactStrictMode: true,
};

export default nextConfig;