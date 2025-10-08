/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['https://res.cloudinary.com/'],
      },      
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default nextConfig;
