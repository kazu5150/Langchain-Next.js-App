/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-backend-url.vercel.app/:path*', // 後でVercelのURLに更新
      },
    ]
  },
}

export default nextConfig;