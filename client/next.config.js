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
    KEY: process.env.API_KEY,
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
    domains: ['i.ibb.co'],
  },
};

module.exports = nextConfig;
