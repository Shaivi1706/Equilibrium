import "dotenv/config"; // Load environment variables

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "d3njjcbhbojbot.cloudfront.net", // Coursera image CDN
      "coursera.org",
      "picsum.photos", // Added for placeholder/random images
    ],
    unoptimized: false, // Keep Next.js image optimizations
  },
};

export default nextConfig;
