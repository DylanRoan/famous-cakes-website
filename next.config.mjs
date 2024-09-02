/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
        WEB_URL: process.env.WEB_URL,
        STRIPE_PUBLISHABLE: process.env.STRIPE_PUBLISHABLE
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: process.env.WEB_URL }, 
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" }
                ]
            }
        ]
    }
};

export default nextConfig;
