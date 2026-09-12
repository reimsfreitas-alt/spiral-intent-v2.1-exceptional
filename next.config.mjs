/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://spiral-wealth-mega-landing-luu9xs.v2.appdeploy.ai/:path*',
        permanent: false
      }
    ];
  }
};

export default nextConfig;
