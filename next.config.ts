/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hackathon-submissions.sgp1.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
