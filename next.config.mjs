/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Allow Next.js to optimize images (previously disabled). This lets the logo be served at ~106px width instead of full 400px.
    formats: ["image/avif", "image/webp"],
    // Add precise small sizes to avoid overserving tiny assets like the nav logo.
    imageSizes: [64, 96, 106, 128, 160, 256, 384],
    // Keep default deviceSizes unless we want to trim; we could reduce but leaving defaults for now.
  },
}

export default nextConfig