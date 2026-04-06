/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 100],
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
