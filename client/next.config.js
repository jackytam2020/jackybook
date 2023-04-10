/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
  env: {
    HOST: process.env.SERVER,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/assets/**',
      },
    ],
  },
};

module.exports = nextConfig;
