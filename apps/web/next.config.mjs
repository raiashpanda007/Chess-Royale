/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  typescript:{
    ignoreBuildErrors: true
  }
}

export default nextConfig
