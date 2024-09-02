/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
        WEB_URL: process.env.WEB_URL,
        STRIPE_PUBLISHABLE: process.env.STRIPE_PUBLISHABLE
    }
};

export default nextConfig;
