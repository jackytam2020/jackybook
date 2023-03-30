/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
  env: {
    HOST: `https://${process.env.SERVER}`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.SERVER,
        port: '',
        pathname: '/assets/**',
      },
    ],
  },
};

module.exports = nextConfig;
