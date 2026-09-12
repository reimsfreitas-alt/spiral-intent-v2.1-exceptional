/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://spiral-wealth-mega-landing-luu9xs.v2.appdeploy.ai/:path*'
      }
    ];
  }
};

export default nextConfig;
